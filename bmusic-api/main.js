const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);
const { incrementPlayCount } = require("./database/db");
const upload = require("./services/uploadConfig");
const { handleFileDelete } = require("./services/deleteController");
const {
  handleFileUpload,
  handleAllSongs,
  handleAllArtists,
  handleAllAlbums,
} = require("./services/uploadController");

const app = express();
const port = 4000;

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// Route to handle the root endpoint
app.get("/", (req, res) => {
  res.send(["Welcome", "to", "bmusic"].map((str) => str.toUpperCase()));
});

// Route to handle fetching all songs
app.get("/songs", handleAllSongs);
app.get("/artists", handleAllArtists);
app.get("/albums", handleAllAlbums);
// Endpoint for music streaming
app.get("/data/uploads/:filename", (req, res) => {
  console.log("triggered music stream");
  const filename = req.params.filename;

  const filePath = path.join(__dirname, "data/uploads", filename);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(err);
      return res.status(404).send("File not found");
    }

    const { range } = req.headers;
    console.log("Range header:", range);
    if (!range) {
      const head = {
        "Content-Length": stats.size,
        "Content-Type": "audio/mpeg",
      };
      console.log(head);
      res.writeHead(200, head);
      console.log("No range header, sending entire file");
      const stream = fs.createReadStream(filePath);

      stream.pipe(res);
      stream.on("error", (err) => res.status(500).send(err));
      return;
    }

    const positions = range.replace(/bytes=/, "").split("-");

    const start = parseInt(positions[0], 10);
    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    const chunksize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${total}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "audio/mpeg",
    });

    const stream = fs.createReadStream(filePath, { start, end });
    console.log("Streaming range:", start, "-", end);
    stream.pipe(res);
    stream.on("error", (err) => res.status(500).send(err));
  });
});
// Endpoint to get detailed info about the quality of the audio file
app.get("/audio-info/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "data/uploads", filename);

  ffmpeg(filePath).ffprobe((err, metadata) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error extracting metadata");
    }

    const audioStream = metadata.streams.find(
      (stream) => stream.codec_type === "audio"
    );
    if (!audioStream) {
      return res.status(404).send("No audio stream found");
    }

    const audioInfo = {
      codec: audioStream.codec_name,
      sampleRate: audioStream.sample_rate,
      channels: audioStream.channels,
      bitrate: audioStream.bit_rate,
      duration: metadata.format.duration,
    };

    res.json(audioInfo);
  });
});
// Route to handle file uploads
app.post("/upload", upload, handleFileUpload);

app.post("/increment", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send("Song ID is required");
  }

  try {
    const playCount = await incrementPlayCount(id);
    res.status(200).json({ playCount });
  } catch (err) {
    console.error("Error incrementing play count:", err);
    res.status(500).send("Error incrementing play count");
  }
});
// Route to serve cover images
app.get("/data/covers/*", (req, res) => {
  const filePath = path.join(__dirname, req.path);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", filePath);
      return res.status(404).send("File not found");
    }
    res.sendFile(filePath);
  });
});

// Route to handle file deletion
app.delete("/delete", handleFileDelete);

// Create HTTP server
const server = http.createServer(app);
// Start the server
server.listen(port, () => console.log(`Listening on port ${port}`));

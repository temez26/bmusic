const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const WebSocket = require("ws");
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

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    let request;
    try {
      request = JSON.parse(message);
    } catch (err) {
      console.error("Invalid message format:", err);
      ws.send(
        "Invalid message format. Expected JSON with 'filePath' and 'type'."
      );
      return;
    }

    const { filePath, type } = request;

    if (!filePath || !type) {
      ws.send("Missing 'filePath' or 'type' in the message.");
      return;
    }

    const absolutePath = path.join(__dirname, filePath);
    console.log(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();
    console.log(ext);

    if (type === "mp3") {
      // Convert FLAC to MP3 and stream
      console.log("converting flac to mp3 to client");
      if (ext !== ".flac") {
        ws.send(
          "Unsupported file format for MP3 conversion. Expected a FLAC file."
        );
        return;
      }

      ffmpeg(absolutePath)
        .format("mp3")
        .on("start", () => {
          console.log(`Starting conversion of ${absolutePath} to MP3.`);
        })
        .on("error", (err) => {
          console.error("FFmpeg error:", err);
          ws.send("Error processing file with FFmpeg.");
        })
        .on("end", () => {
          ws.send("EOF");
        })
        .pipe()
        .on("data", (chunk) => {
          console.log(chunk);
          ws.send(chunk);
        });
    } else if (type === "flac") {
      // Stream original FLAC file
      if (ext !== ".flac" && ext !== ".mp3") {
        ws.send("Unsupported file format for streaming.");
        return;
      }
      console.log("Sending flac file to the client");
      const readStream = fs.createReadStream(absolutePath);

      readStream.on("data", (chunk) => ws.send(chunk));
      readStream.on("end", () => ws.send("EOF"));
      readStream.on("error", (err) => {
        console.error("Error reading file:", err);
        ws.send("Error reading file.");
      });
    } else {
      ws.send("Unsupported type. Use 'mp3' or 'flac'.");
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
  ws.send("Welcome to the WebSocket server!");
});
// Start the server
server.listen(port, () => console.log(`Listening on port ${port}`));

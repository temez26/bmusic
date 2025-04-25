const fs = require("fs");
const path = require("path");

/**
 * Helper function to stream a media file.
 * Determines if a full file or byte-range should be sent.
 */
function streamMedia(req, res) {
  console.log("Triggered music stream");
  const { filename } = req.params;
  const filePath = path.join("/app/data/uploads", filename);

  // Determine MIME type based on file extension
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    ".mp3": "audio/mpeg",
    ".flac": "audio/flac",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".aac": "audio/aac",
  };
  const mimeType = mimeTypes[ext] || "application/octet-stream";

  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(err);
      return res.status(404).send("File not found");
    }

    const { range } = req.headers;

    if (!range) {
      sendFullFile(res, stats, mimeType, filePath);
    } else {
      sendPartialFile(req, res, stats, mimeType, filePath, range);
    }
  });
}

/**
 * Sends the entire file if no range is specified.
 */
function sendFullFile(res, stats, mimeType, filePath) {
  const head = {
    "Content-Length": stats.size,
    "Content-Type": mimeType,
    "Accept-Ranges": "bytes",
  };
  console.log("No range header, sending entire file:", head);
  res.writeHead(200, head);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on("error", (err) => res.status(500).send(err));
}

/**
 * Sends a byte-range of the file for streaming purposes.
 */
function sendPartialFile(req, res, stats, mimeType, filePath, range) {
  const positions = range.replace(/bytes=/, "").split("-");
  const start = parseInt(positions[0], 10);
  const total = stats.size;
  const maxChunkSize = 5 * 1024 * 1024; // 5 MB in bytes
  // Determine the requested end byte, or default to the end of file
  let requestedEnd = positions[1] ? parseInt(positions[1], 10) : total - 1;
  // Limit the end position to ensure the chunk is at most 5MB
  const end = Math.min(requestedEnd, start + maxChunkSize - 1, total - 1);
  const chunksize = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${total}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": mimeType,
  };
  res.writeHead(206, headers);
  const stream = fs.createReadStream(filePath, { start, end });
  stream.pipe(res);
  stream.on("error", (err) => res.status(500).send(err));
}
module.exports = { streamMedia };

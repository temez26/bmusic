const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const upload = require("./services/uploadConfig");
const { handleFileDelete } = require("./services/deleteController");
const {
  handleFileUpload,
  handleAllSongs,
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

// Route to handle file uploads
app.post("/upload", upload, handleFileUpload);

// Route to handle file deletion
app.delete("/delete", handleFileDelete);

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const filePath = path.join(__dirname, message.toString());
    const readStream = fs.createReadStream(filePath);

    readStream.on("data", (chunk) => ws.send(chunk));
    readStream.on("end", () => ws.send("EOF"));
    readStream.on("error", (err) => {
      console.error("Error reading file:", err);
      ws.send("Error reading file");
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
  ws.send("Welcome to the WebSocket server!");
});

// Start the server
server.listen(port, () => console.log(`Listening on port ${port}`));

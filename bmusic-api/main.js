// --- Node.js and Third-Party Modules ---
const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");

// --- Local Modules and Controllers ---
const playlistRouter = require("./services/playlistController");
const upload = require("./services/uploadConfig");
const { incrementPlayCount } = require("./database/db");
const { handleFileDelete } = require("./services/deleteController");
const {
  handleAllSongs,
  handleAllArtists,
  handleAllAlbums,
} = require("./services/fetchController");
const { handleFileUpload } = require("./services/uploadController");
const { streamMedia } = require("./services/streamController");

const app = express();
const port = 4000;

// --- Middleware Configuration ---
app.use(express.json());
app.use(cors());
app.options("*", cors());

// --- Routes ---
// Root endpoint
app.get("/", (req, res) => {
  const welcomeMsg = ["Welcome", "to", "bmusic"].map((str) =>
    str.toUpperCase()
  );
  res.send(welcomeMsg);
});

// Fetch routes
app.get("/songs", handleAllSongs);
app.get("/artists", handleAllArtists);
app.get("/albums", handleAllAlbums);
app.use("/playlists", playlistRouter);

// Music streaming endpoint
app.get("/data/uploads/:filename", streamMedia);

// File upload endpoint
app.post("/upload", upload, handleFileUpload);

// Increment play count endpoint
app.post("/increment", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).send("Song ID is required");

  try {
    const playCount = await incrementPlayCount(id);
    res.status(200).json({ playCount });
  } catch (err) {
    console.error("Error incrementing play count:", err);
    res.status(500).send("Error incrementing play count");
  }
});

// Serve cover images endpoint
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

// Delete file endpoint
app.delete("/delete", handleFileDelete);

// --- Create and Start HTTP Server ---
const server = http.createServer(app);

// Set up Socket.IO server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }, // configure your allowed origins
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("updatePlayerState", (state) => {
    // Broadcast the updated state to all other clients
    socket.broadcast.emit("playerState", state);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

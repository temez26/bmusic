// --- Node.js and Third-Party Modules ---
const http = require("http");
const express = require("express");
const cors = require("cors");

// --- Local Modules and Controllers ---
const playlistRouter = require("./services/playlistController");
const {
  incrementPlayCountHandler,
  serveCoverImage,
} = require("./services/helperController");
const upload = require("./services/uploadConfig");
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

// Increment play count endpoint using the controller
app.post("/increment", incrementPlayCountHandler);

// Serve cover images endpoint using the controller
app.get("/data/covers/*", serveCoverImage);

// Delete file endpoint
app.delete("/delete", handleFileDelete);

// --- Create and Start HTTP Server ---
const server = http.createServer(app);

// Set up Socket.IO server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
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

const http = require("http");
const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());
app.options("*", cors());

// Use the separate routes module
app.use("/", routes);

const server = http.createServer(app);

// Set up Socket.IO server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});

// Store state
const devices = new Set();
let globalMainDeviceId = "";
let currentPlayerState = null;
let currentPlaylist = [];

// Helper functions
function validatePlayerState(state) {
  return (
    state && typeof state === "object" && typeof state.deviceId === "string"
  );
}

function validatePlaylist(songs) {
  return Array.isArray(songs);
}

io.on("connection", (socket) => {
  const deviceId = socket.handshake.query.deviceId;

  if (!deviceId) {
    console.warn("Device connected without ID");
    return;
  }

  console.log(`Device connected: ${deviceId}`);
  devices.add(deviceId);

  // Broadcast updated device list to all clients
  io.emit("devices", Array.from(devices));

  // Initialize a global main on first connect
  if (!globalMainDeviceId) {
    globalMainDeviceId = deviceId;
  }

  // Send initial state to the newly connected client
  socket.emit("mainDeviceChanged", globalMainDeviceId);

  if (currentPlayerState) {
    socket.emit("playerState", currentPlayerState);
  }

  if (currentPlaylist.length > 0) {
    socket.emit("playlistState", currentPlaylist);
  }

  // Handle client messages
  socket.on("setMainDevice", (id) => {
    if (!id || typeof id !== "string") {
      console.warn("Invalid main device ID received");
      return;
    }

    console.log(`Main device changed to: ${id}`);
    globalMainDeviceId = id;
    io.emit("mainDeviceChanged", id);
  });

  socket.on("updatePlayerState", (state) => {
    if (!validatePlayerState(state)) {
      console.warn("Invalid player state received");
      return;
    }

    // Handle sync_request differently - send current state back
    if (state.action === "sync_request") {
      if (currentPlayerState) {
        socket.emit("playerState", currentPlayerState);
      }
      if (currentPlaylist.length > 0) {
        socket.emit("playlistState", currentPlaylist);
      }
      return;
    }

    // Store the latest state
    currentPlayerState = state;

    // Broadcast to all other clients
    socket.broadcast.emit("playerState", state);
  });

  socket.on("updatePlaylistState", (songs) => {
    if (!validatePlaylist(songs)) {
      console.warn("Invalid playlist data received");
      return;
    }

    currentPlaylist = songs;
    socket.broadcast.emit("playlistState", songs);
  });

  socket.on("disconnect", () => {
    if (deviceId) {
      console.log(`Device disconnected: ${deviceId}`);
      devices.delete(deviceId);
      io.emit("devices", Array.from(devices));

      // Reset main if it disconnected
      if (deviceId === globalMainDeviceId) {
        const remainingDevices = Array.from(devices);
        globalMainDeviceId =
          remainingDevices.length > 0 ? remainingDevices[0] : "";
        io.emit("mainDeviceChanged", globalMainDeviceId);

        if (remainingDevices.length === 0) {
          // Clear state if all devices disconnected
          currentPlayerState = null;
          currentPlaylist = [];
        }
      }
    }
  });
});

// Log uncaught exceptions to prevent server crashes
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

server.listen(port, () => console.log(`Listening on port ${port}`));

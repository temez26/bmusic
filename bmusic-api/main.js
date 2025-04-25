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
const devices = new Set();
let globalMainDeviceId = "";

io.on("connection", (socket) => {
  const deviceId = socket.handshake.query.deviceId;
  if (deviceId) {
    devices.add(deviceId);
    io.emit("devices", Array.from(devices));

    // 1) Initialize a global main on first connect
    if (!globalMainDeviceId) {
      globalMainDeviceId = deviceId;
    }

    // 2) Tell this new client who the main is
    socket.emit("mainDeviceChanged", globalMainDeviceId);
  }

  socket.on("setMainDevice", (id) => {
    // update global and broadcast
    globalMainDeviceId = id;
    io.emit("mainDeviceChanged", id);
  });

  socket.on("updatePlayerState", (state) => {
    socket.broadcast.emit("playerState", state);
  });
  socket.on("updatePlaylistState", (songs) => {
    socket.broadcast.emit("playlistState", songs);
  });

  socket.on("disconnect", () => {
    if (deviceId) {
      devices.delete(deviceId);
      io.emit("devices", Array.from(devices));
      // optional: reset main if it disconnected
      if (deviceId === globalMainDeviceId) {
        globalMainDeviceId = Array.from(devices)[0] || "";
        io.emit("mainDeviceChanged", globalMainDeviceId);
      }
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

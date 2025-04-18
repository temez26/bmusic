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

io.on("connection", (socket) => {
  const deviceId = socket.handshake.query.deviceId;
  if (deviceId) {
    devices.add(deviceId);
    io.emit("devices", Array.from(devices));
  }

  // ←– new handler
  socket.on("setMainDevice", (id) => {
    // let everyone know which device is now the master
    io.emit("mainDeviceChanged", id);
  });

  socket.on("disconnect", () => {
    if (deviceId) {
      devices.delete(deviceId);
      io.emit("devices", Array.from(devices));
    }
  });

  socket.on("updatePlayerState", (state) => {
    socket.broadcast.emit("playerState", state);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

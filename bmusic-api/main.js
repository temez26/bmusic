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

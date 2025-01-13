const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const upload = require("./upload/uploadConfig");
const { handleFileDelete } = require("./upload/deleteController");
const {
  handleFileUpload,
  handleAllSongs,
} = require("./upload/uploadController");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(["Welcome", "to", "bmusic"].map((str) => str.toUpperCase()));
});

app.get("/songs", handleAllSongs);

app.post("/upload", upload, handleFileUpload);
app.delete("/delete", handleFileDelete);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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

server.listen(port, () => console.log(`Listening on port ${port}`));

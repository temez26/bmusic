const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { getAllSongs, insertSong } = require("./db");
const { upload, handleFileUpload } = require("./upload");

const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Test route to insert data into the songs table
app.post("/test", async (req, res) => {
  const { title, artist, album, genre, file_path } = req.body;
  try {
    const song = await insertSong(title, artist, album, genre, file_path);
    res.status(201).json(song);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting data into the database");
  }
});

// Endpoint to fetch all data from the songs table
app.get("/results", async (req, res) => {
  try {
    const songs = await getAllSongs();
    res.status(200).json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data from database");
  }
});

// Endpoint to upload music files and extract metadata
app.post("/upload", upload.single("file"), handleFileUpload);

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);

    const filePath = path.join(__dirname, message.toString());

    const readStream = fs.createReadStream(filePath);
    readStream.on("data", (chunk) => {
      ws.send(chunk);
    });

    readStream.on("end", () => {
      ws.send("EOF"); // Indicate the end of the file
    });

    readStream.on("error", (err) => {
      console.error("Error reading file:", err);
      ws.send("Error reading file");
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.send("Welcome to the WebSocket server!");
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

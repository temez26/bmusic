const express = require("express");
const cors = require("cors");
const config = require("./config");
const { errorHandler } = require("./shared/http");

const songsRoutes = require("./modules/songs/songs.routes");
const albumsRoutes = require("./modules/albums/albums.routes");
const artistsRoutes = require("./modules/artists/artists.routes");
const playlistsRoutes = require("./modules/playlists/playlists.routes");
const uploadsRoutes = require("./modules/uploads/uploads.routes");
const mediaRoutes = require("./modules/media/media.routes");

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/songs", songsRoutes);
app.use("/albums", albumsRoutes);
app.use("/artists", artistsRoutes);
app.use("/playlists", playlistsRoutes);
app.use("/uploads", uploadsRoutes);
app.use("/data", mediaRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

module.exports = app;

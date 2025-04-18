const express = require("express");
const router = express.Router();

// --- Local Modules and Controllers ---
const {
  playlistRouter,
  incrementPlayCountHandler,
  serveCoverImage,
  upload,
  handleFileDelete,
  handleAllSongs,
  handleAllArtists,
  handleAllAlbums,
  handleFileUpload,
  streamMedia,
} = require("../services");

// Root endpoint
router.get("/", (req, res) => {
  const welcomeMsg = ["Welcome", "to", "bmusic"].map((str) =>
    str.toUpperCase()
  );
  res.send(welcomeMsg);
});

// Fetch routes
router.get("/songs", handleAllSongs);
router.get("/artists", handleAllArtists);
router.get("/albums", handleAllAlbums);
router.use("/playlists", playlistRouter);

// Music streaming endpoint
router.get("/data/uploads/:filename", streamMedia);

// File upload endpoint
router.post("/upload", upload, handleFileUpload);

// Increment play count endpoint using the controller
router.post("/increment", incrementPlayCountHandler);

// Serve cover images endpoint using the controller
router.get("/data/covers/*", serveCoverImage);

// Delete file endpoint
router.delete("/delete", handleFileDelete);

module.exports = router;

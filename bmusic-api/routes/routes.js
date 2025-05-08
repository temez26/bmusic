const express = require("express");
const router = express.Router();

// --- Local Modules and Controllers ---
const {
  playlistRouter,
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
router.get("/songs/:limit?", handleAllSongs);
router.get("/artists", handleAllArtists);
router.get("/albums", handleAllAlbums);
router.use("/playlists", playlistRouter);

// Music streaming endpoint
router.get("/stream/:trackId/:filename", streamMedia);

// File upload endpoint
router.post("/upload", upload, handleFileUpload);

// Serve cover images endpoint using the controller
router.get("/data/covers/*", serveCoverImage);

// Delete file endpoint
router.delete("/delete", handleFileDelete);

module.exports = router;

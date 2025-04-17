const express = require("express");
const router = express.Router();
const {
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getPlaylistSongs,
  getAllPlaylists,
  deletePlaylist,
} = require("../database/db");

// Create a new playlist
router.post("/", async (req, res) => {
  const { name, description, created_by } = req.body;
  try {
    const playlist = await createPlaylist(name, description, created_by);
    res.status(201).json(playlist);
  } catch (err) {
    console.error("Error creating playlist:", err);
    res.status(500).json({ error: "Error creating playlist" });
  }
});

// Add a song to a playlist
router.post("/:playlistId/songs", async (req, res) => {
  const { playlistId } = req.params;
  const { song_id } = req.body;
  try {
    const result = await addSongToPlaylist(playlistId, song_id);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error adding song to playlist:", err);
    res.status(500).json({ error: "Error adding song to playlist" });
  }
});
// remove playlist
router.delete("/:playlistId", async (req, res) => {
  const { playlistId } = req.params;

  try {
    const playlist = await deletePlaylist(playlistId);

    res.status(200).json(playlist);
  } catch (err) {
    console.error("Error deleting playlist", err);
    res.status(500).json({ error: "Error deleting playlist" });
  }
});

// Remove a song from a playlist
router.delete("/:playlistId/songs/:songId", async (req, res) => {
  const { playlistId, songId } = req.params;
  try {
    const result = await removeSongFromPlaylist(playlistId, songId);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error removing song from playlist:", err);
    res.status(500).json({ error: "Error removing song from playlist" });
  }
});

// Get all songs from a playlist
router.get("/:playlistId/songs", async (req, res) => {
  const { playlistId } = req.params;
  try {
    const songs = await getPlaylistSongs(playlistId);
    res.status(200).json(songs);
  } catch (err) {
    console.error("Error fetching playlist songs:", err);
    res.status(500).json({ error: "Error fetching playlist songs" });
  }
});

// Get all playlists
router.get("/", async (req, res) => {
  try {
    const playlists = await getAllPlaylists();
    res.status(200).json(playlists);
  } catch (err) {
    console.error("Error fetching playlists:", err);
    res.status(500).json({ error: "Error fetching playlists" });
  }
});

module.exports = router;

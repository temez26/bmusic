const fs = require("fs");
const { deleteSong, getSongById, getAllSongs } = require("../database/db");

// Function to handle file deletion
const handleFileDelete = async (req, res) => {
  const { id } = req.body;

  try {
    // Fetch the song by ID
    const song = await getSongById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const filePath = song.file_path;
    if (!filePath) {
      return res.status(400).json({ message: "File path is missing" });
    }

    // Delete the file from the filesystem
    fs.unlinkSync(filePath);

    // Delete the song from the database
    await deleteSong(id);

    // Fetch all songs after deletion and send response
    const songs = await getAllSongs();
    res.status(200).json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting file" });
  }
};

module.exports = {
  handleFileDelete,
};

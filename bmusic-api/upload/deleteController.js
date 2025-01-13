const { deleteSong, getSongById, getAllSongs } = require("../database/db");
const fs = require("fs");

const handleFileDelete = async (req, res) => {
  const { id } = req.body;
  try {
    const song = await getSongById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const filePath = song.file_path;

    if (!filePath) {
      return res.status(400).json({ message: "File path is missing" });
    }

    fs.unlinkSync(filePath);

    await deleteSong(id);
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

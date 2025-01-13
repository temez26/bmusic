const mm = require("music-metadata");
const { insertSong, deleteSong, getSongById, getAllSongs } = require("./db");
const fs = require("fs");

const handleFileUpload = async (req, res) => {
  const files = req.files.files || [];
  const errors = [];
  const successfulUploads = [];
  let albumCoverUrl = null;

  try {
    for (const file of files) {
      if (file.mimetype.startsWith("image/")) {
        albumCoverUrl = file.path;
        successfulUploads.push(file.originalname);
      }
    }

    for (const file of files) {
      if (file.mimetype.startsWith("audio/")) {
        try {
          const filePath = file.path;
          const metadata = await mm.parseFile(filePath);
          const { title, artist, album, genre } = metadata.common;

          await insertSong(
            title || file.originalname,
            artist,
            album,
            genre,
            filePath,
            albumCoverUrl
          );
          successfulUploads.push(file.originalname);
        } catch (err) {
          errors.push({ file: file.originalname, error: err.message });
        }
      } else if (!file.mimetype.startsWith("image/")) {
        errors.push({ file: file.originalname, error: "Invalid file type" });
      }
    }

    const songs = await getAllSongs();
    console.log("got songs");
    res.status(201).json({ songs, errors, successfulUploads });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error uploading files and extracting metadata");
  }
};

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
  handleFileUpload,
  handleFileDelete,
};

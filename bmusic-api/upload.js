const multer = require("multer");
const mm = require("music-metadata");
const path = require("path");
const fs = require("fs");
const { insertSong, deleteSong, getSongById, getAllSongs } = require("./db");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /mp3|flac|wav|aac/;
  const allowedMimeTypes = /audio\/mpeg|audio\/flac|audio\/wav|audio\/aac/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isExtnameValid = allowedExtensions.test(extname);
  const isMimetypeValid = allowedMimeTypes.test(mimetype);

  if (isExtnameValid && isMimetypeValid) {
    return cb(null, true);
  } else {
    cb(new Error("Only music files are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

const handleFileUpload = async (req, res) => {
  const filePath = req.file.path;
  try {
    const metadata = await mm.parseFile(filePath);
    const { title, artist, album, genre } = metadata.common;
    await insertSong(
      title || req.file.originalname,
      artist,
      album,
      genre,
      filePath
    );
    const songs = await getAllSongs();
    res.status(201).json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error uploading file and extracting metadata");
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
  upload,
  handleFileUpload,
  handleFileDelete,
};

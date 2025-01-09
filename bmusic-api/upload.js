const multer = require("multer");
const mm = require("music-metadata");
const path = require("path");
const { insertSong } = require("./db");

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
    const song = await insertSong(
      title || req.file.originalname,
      artist,
      album,
      genre,
      filePath
    );
    res.status(201).json(song);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file and extracting metadata");
  }
};

module.exports = {
  upload,
  handleFileUpload,
};

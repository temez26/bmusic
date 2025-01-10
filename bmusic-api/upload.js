const multer = require("multer");
const mm = require("music-metadata");
const path = require("path");
const fs = require("fs");
const { insertSong, deleteSong, getSongById, getAllSongs } = require("./db");

// Ensure directories exist
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    if (file.mimetype.startsWith("audio/")) {
      uploadDir = "data/uploads";
    } else if (file.mimetype.startsWith("image/")) {
      uploadDir = "data/covers";
    }
    ensureDirectoryExistence(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /mp3|flac|wav|aac|jpg|jpeg|png/;
  const allowedMimeTypes =
    /audio\/mpeg|audio\/flac|audio\/wav|audio\/aac|image\/jpeg|image\/png/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isExtnameValid = allowedExtensions.test(extname);
  const isMimetypeValid = allowedMimeTypes.test(mimetype);

  if (isExtnameValid && isMimetypeValid) {
    return cb(null, true);
  } else {
    cb(new Error("Only music and image files are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "files", maxCount: 100 },
  { name: "cover", maxCount: 1 },
]);

const handleFileUpload = async (req, res) => {
  const files = req.files.files || [];
  const cover = req.files.cover ? req.files.cover[0] : null;
  const errors = [];
  const successfulUploads = [];

  try {
    for (const file of files) {
      if (file.mimetype.startsWith("audio/")) {
        try {
          const filePath = file.path;
          const metadata = await mm.parseFile(filePath);
          const { title, artist, album, genre } = metadata.common;
          const albumCoverUrl = cover ? cover.path : null;
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
      } else {
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
    const albumCoverUrl = song.album_cover_url;
    if (!filePath) {
      return res.status(400).json({ message: "File path is missing" });
    }

    fs.unlinkSync(filePath);
    if (albumCoverUrl) {
      fs.unlinkSync(albumCoverUrl);
    }
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

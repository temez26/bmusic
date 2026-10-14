const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const config = require("../../config");

const AUDIO_EXTENSIONS = new Set([".mp3", ".flac", ".wav", ".ogg", ".aac", ".m4a"]);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const fileKind = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (AUDIO_EXTENSIONS.has(ext)) return "audio";
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  return null;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileKind(file) === "audio" ? config.paths.uploads : config.paths.covers);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`);
  },
});

// Unsupported files are skipped and reported back instead of failing the batch.
const fileFilter = (req, file, cb) => {
  file.kind = fileKind(file);
  if (!file.kind) {
    req.rejectedFiles = [...(req.rejectedFiles || []), file.originalname];
  }
  cb(null, Boolean(file.kind));
};

module.exports = multer({ storage, fileFilter }).array("files", 1000);

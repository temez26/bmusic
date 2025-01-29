const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the directory exists, create if it doesn't
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage settings for multer
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

// File filter to allow only specific file types
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
    return cb(null, false);
  }
};

// Configure multer upload settings
const upload = multer({
  storage,
  fileFilter,
}).fields([{ name: "files", maxCount: 1000 }]);

module.exports = upload;

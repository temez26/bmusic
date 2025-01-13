const mm = require("music-metadata");
const { insertSong, getAllSongs } = require("../database/db");

// Function to handle fetching all songs from the database
const handleAllSongs = async (req, res) => {
  try {
    const songs = await getAllSongs();
    res.status(200).json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data from database");
  }
};

// Function to handle file uploads and metadata extraction
const handleFileUpload = async (req, res) => {
  const files = req.files.files || [];
  const errors = [];
  const successfulUploads = [];
  let albumCoverUrl = null;

  try {
    // Process image files to get album cover URL
    for (const file of files) {
      if (file.mimetype.startsWith("image/")) {
        albumCoverUrl = file.path;
        successfulUploads.push(file.originalname);
      }
    }

    // Process audio files to extract metadata and insert into database
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

    // Fetch all songs after upload and send response
    const songs = await getAllSongs();
    console.log("got songs");
    res.status(201).json({ songs, errors, successfulUploads });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error uploading files and extracting metadata");
  }
};

module.exports = {
  handleFileUpload,
  handleAllSongs,
};

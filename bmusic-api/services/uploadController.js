const mm = require("music-metadata");

const {
  insertSong,
  getOrInsertArtist,
  getOrInsertAlbum,
  getAllSongs,
} = require("../database/songsdb");

// Function to handle file uploads and metadata extraction
const handleFileUpload = async (req, res) => {
  const files = req.files.files || [];
  const errors = [];
  const successfulUploads = [];
  let albumCoverUrl = null;
  let albumName = null;
  let artistName = null;
  let genre = null;

  // Find the last image file in the list
  for (let i = files.length - 1; i >= 0; i--) {
    if (files[i].mimetype.startsWith("image/")) {
      albumCoverUrl = files[i].path;
      break;
    }
  }

  try {
    // Process audio files to extract metadata and insert into database
    for (const file of files) {
      if (file.mimetype.startsWith("audio/")) {
        try {
          const filePath = file.path;
          const metadata = await mm.parseFile(filePath);
          const { title, artist, album, genre: fileGenre } = metadata.common;
          const duration = metadata.format.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          const length = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

          if (!albumName) albumName = album;
          if (!artistName) artistName = artist;
          if (!genre) genre = fileGenre;

          // Fetch or insert artist and album to get their IDs
          const artist_id = await getOrInsertArtist(artistName);
          const album_id = await getOrInsertAlbum(
            albumName,
            artist_id,
            genre,
            albumCoverUrl
          );

          await insertSong(
            title || file.originalname,
            artist_id,
            album_id,
            albumName,
            artistName,
            genre,
            filePath,
            albumCoverUrl,
            length
          );
          successfulUploads.push(file.originalname);
          console.log(`Audio file uploaded successfully: ${file.originalname}`);
        } catch (err) {
          errors.push({ file: file.originalname, error: err.message });
          console.error(
            `Error uploading audio file: ${file.originalname}`,
            err
          );
        }
      } else if (!file.mimetype.startsWith("image/")) {
        errors.push({ file: file.originalname, error: "Invalid file type" });
        console.error(`Invalid file type: ${file.originalname}`);
      }
    }

    // Fetch all songs after upload and send response
    const songs = await getAllSongs();
    res.status(201).json({ songs, errors, successfulUploads });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error uploading files and extracting metadata");
  }
};

module.exports = {
  handleFileUpload,
};

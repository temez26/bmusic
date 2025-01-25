const mm = require("music-metadata");
const {
  insertSong,
  getAllSongs,
  getOrInsertArtist,
  getOrInsertAlbum,
  getAllArtists,
  getAllAlbums,
} = require("../database/db");

// Function to handle fetching all songs from the database
const handleAllSongs = async (req, res) => {
  try {
    const songs = await getAllSongs();
    const artist = await getAllArtists();
    res.status(200).json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data for Songs");
  }
};
const handleAllArtists = async (req, res) => {
  try {
    const artists = await getAllArtists();
    res.status(200).json(artists);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data for Artists");
  }
};
const handleAllAlbums = async (req, res) => {
  try {
    const artists = await getAllAlbums();
    res.status(200).json(artists);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data for Artists");
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
        console.log(`Image file uploaded successfully: ${file.originalname}`);
      }
    }

    // Process audio files to extract metadata and insert into database
    for (const file of files) {
      if (file.mimetype.startsWith("audio/")) {
        try {
          const filePath = file.path;
          const metadata = await mm.parseFile(filePath);
          const { title, artist, album, genre } = metadata.common;
          const duration = metadata.format.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          const length = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

          // Fetch or insert artist and album to get their IDs
          const artist_id = await getOrInsertArtist(artist);
          const album_id = await getOrInsertAlbum(
            album,
            artist_id,
            genre,
            albumCoverUrl
          );

          await insertSong(
            title || file.originalname,
            artist_id,
            album_id,
            album,
            artist,
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
  handleAllSongs,
  handleAllArtists,
  handleAllAlbums,
};

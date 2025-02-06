const { getAllSongs, getAllArtists, getAllAlbums } = require("../database/db");

// Function to handle fetching all songs from the database
const handleAllSongs = async (req, res) => {
  try {
    const songs = await getAllSongs();
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
    const albums = await getAllAlbums();
    res.status(200).json(albums);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data for Albums");
  }
};

module.exports = {
  handleAllSongs,
  handleAllArtists,
  handleAllAlbums,
};

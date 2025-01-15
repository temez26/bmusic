const { Pool } = require("pg");

// Create a new pool instance to manage PostgreSQL connections
const pool = new Pool({
  user: "postgres",
  host: "db-bmusic",
  database: "db-bmusic",
  password: "postgres",
  port: 5432,
});

// Function to insert a new song into the database
const insertSong = async (
  title,
  artist,
  album,
  genre,
  file_path,
  album_cover_url,
  length
) => {
  const result = await pool.query(
    "INSERT INTO songs (title, artist, album, genre, file_path, album_cover_url, length) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [title, artist, album, genre, file_path, album_cover_url, length]
  );
  return result.rows[0];
};

// Function to fetch all songs from the database
const getAllSongs = async () => {
  const result = await pool.query("SELECT * FROM songs");
  return result.rows;
};

// Function to fetch a song by its ID from the database
const getSongById = async (id) => {
  const result = await pool.query("SELECT * FROM songs WHERE id = $1", [id]);
  return result.rows[0];
};

// Function to delete a song by its ID from the database
const deleteSong = async (id) => {
  try {
    const result = await pool.query("DELETE FROM songs WHERE id = $1", [id]);
    return result.rowCount;
  } catch (err) {
    console.error("Error deleting song:", err);
    throw err;
  }
};

// Export the functions for use in other modules
module.exports = {
  insertSong,
  getAllSongs,
  getSongById,
  deleteSong,
};

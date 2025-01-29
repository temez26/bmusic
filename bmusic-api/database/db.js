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
  artist_id,
  album_id,
  artist,
  album,
  genre,
  file_path,
  album_cover_url,
  length
) => {
  const result = await pool.query(
    "INSERT INTO songs (title, artist_id, album_id, artist, album, genre, file_path, album_cover_url, length) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [
      title,
      artist_id,
      album_id,
      album,
      artist,
      genre,
      file_path,
      album_cover_url,
      length,
    ]
  );
  return result.rows[0];
};

// Function to fetch all songs from the database
const getAllSongs = async () => {
  const result = await pool.query("SELECT * FROM songs");
  return result.rows;
};
const getAllArtists = async () => {
  const result = await pool.query("SELECT * FROM artists");
  return result.rows;
};
const getAllAlbums = async () => {
  const result = await pool.query("SELECT * FROM albums");
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

// Function to increment the play count of a song
const incrementPlayCount = async (id) => {
  const result = await pool.query(
    "UPDATE songs SET play_count = play_count + 1 WHERE id = $1 RETURNING play_count",
    [id]
  );
  return result.rows[0].play_count;
};

// Function to get or insert an artist
const getOrInsertArtist = async (artistName) => {
  const result = await pool.query("SELECT id FROM artists WHERE name = $1", [
    artistName,
  ]);
  if (result.rows.length > 0) {
    return result.rows[0].id;
  } else {
    const insertResult = await pool.query(
      "INSERT INTO artists (name) VALUES ($1) RETURNING id",
      [artistName]
    );
    return insertResult.rows[0].id;
  }
};

// Function to get or insert an album
const getOrInsertAlbum = async (
  albumTitle,
  artist_id,
  genre,
  cover_image_url
) => {
  const result = await pool.query(
    "SELECT id FROM albums WHERE title = $1 AND artist_id = $2",
    [albumTitle, artist_id]
  );
  if (result.rows.length > 0) {
    return result.rows[0].id;
  } else {
    const insertResult = await pool.query(
      "INSERT INTO albums (title, artist_id, genre, cover_image_url) VALUES ($1, $2, $3, $4) RETURNING id",
      [albumTitle, artist_id, genre, cover_image_url]
    );
    return insertResult.rows[0].id;
  }
};

// Export the functions for use in other modules
module.exports = {
  insertSong,
  getAllSongs,
  getAllArtists,
  getAllAlbums,
  getSongById,
  deleteSong,
  incrementPlayCount,
  getOrInsertArtist,
  getOrInsertAlbum,
};

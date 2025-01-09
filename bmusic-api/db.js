const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "db-bmusic",
  database: "db-bmusic",
  password: "postgres",
  port: 5432,
});

const insertSong = async (title, artist, album, genre, file_path) => {
  const result = await pool.query(
    "INSERT INTO songs (title, artist, album, genre, file_path) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, artist, album, genre, file_path]
  );
  return result.rows[0];
};

const getAllSongs = async () => {
  const result = await pool.query("SELECT * FROM songs");
  return result.rows;
};

const getSongById = async (id) => {
  const result = await pool.query("SELECT * FROM songs WHERE id = $1", [id]);
  return result.rows[0];
};

const deleteSong = async (id) => {
  try {
    const result = await pool.query("DELETE FROM songs WHERE id = $1", [id]);
    return result.rowCount;
  } catch (err) {
    console.error("Error deleting song:", err);
    throw err;
  }
};
module.exports = {
  insertSong,
  getAllSongs,
  getSongById,
  deleteSong,
};

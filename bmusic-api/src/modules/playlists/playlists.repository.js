const db = require("../../db");

const findAll = async () => {
  const { rows } = await db.query(
    "SELECT * FROM playlists ORDER BY protected DESC, id"
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await db.query("SELECT * FROM playlists WHERE id = $1", [
    id,
  ]);
  return rows[0] || null;
};

const create = async ({ name, description }) => {
  const { rows } = await db.query(
    "INSERT INTO playlists (name, description) VALUES ($1, $2) RETURNING *",
    [name, description]
  );
  return rows[0];
};

const remove = async (id) => {
  await db.query("DELETE FROM playlists WHERE id = $1", [id]);
};

const findSongs = async (playlistId) => {
  const { rows } = await db.query(
    `SELECT s.* FROM songs s
     JOIN playlist_songs ps ON s.id = ps.song_id
     WHERE ps.playlist_id = $1
     ORDER BY s.id`,
    [playlistId]
  );
  return rows;
};

const addSong = async (playlistId, songId) => {
  await db.query(
    "INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)",
    [playlistId, songId]
  );
};

const removeSong = async (playlistId, songId) => {
  const { rowCount } = await db.query(
    "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
    [playlistId, songId]
  );
  return rowCount > 0;
};

const findIdsBySong = async (songId) => {
  const { rows } = await db.query(
    "SELECT playlist_id FROM playlist_songs WHERE song_id = $1",
    [songId]
  );
  return rows.map((row) => row.playlist_id);
};

module.exports = {
  findIdsBySong,
  findAll,
  findById,
  create,
  remove,
  findSongs,
  addSong,
  removeSong,
};

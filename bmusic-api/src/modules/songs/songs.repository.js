const db = require("../../db");

const findAll = async () => {
  const { rows } = await db.query("SELECT * FROM songs ORDER BY id");
  return rows;
};

const findById = async (id) => {
  const { rows } = await db.query("SELECT * FROM songs WHERE id = $1", [id]);
  return rows[0] || null;
};

const create = async (song) => {
  const { rows } = await db.query(
    `INSERT INTO songs
       (title, artist_id, album_id, artist, album, genre, file_path, album_cover_url, length)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      song.title,
      song.artistId,
      song.albumId,
      song.artist,
      song.album,
      song.genre,
      song.filePath,
      song.coverPath,
      song.length,
    ]
  );
  return rows[0];
};

const remove = async (id) => {
  const { rowCount } = await db.query("DELETE FROM songs WHERE id = $1", [id]);
  return rowCount > 0;
};

const incrementPlayCount = async (id) => {
  const { rows } = await db.query(
    "UPDATE songs SET play_count = play_count + 1 WHERE id = $1 RETURNING play_count",
    [id]
  );
  return rows[0] ? rows[0].play_count : null;
};

module.exports = { findAll, findById, create, remove, incrementPlayCount };

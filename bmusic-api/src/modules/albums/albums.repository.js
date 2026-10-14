const db = require("../../db");

const findAll = async () => {
  const { rows } = await db.query("SELECT * FROM albums ORDER BY title");
  return rows;
};

// Returns the album id, creating the album if needed. A cover is only
// filled in when the album does not have one yet.
const findOrCreate = async ({ title, artistId, genre, coverPath }) => {
  const existing = await db.query(
    `UPDATE albums SET cover_image_url = COALESCE(cover_image_url, $3)
     WHERE title = $1 AND artist_id = $2
     RETURNING id`,
    [title, artistId, coverPath]
  );
  if (existing.rows[0]) return existing.rows[0].id;

  const { rows } = await db.query(
    "INSERT INTO albums (title, artist_id, genre, cover_image_url) VALUES ($1, $2, $3, $4) RETURNING id",
    [title, artistId, genre, coverPath]
  );
  return rows[0].id;
};

module.exports = { findAll, findOrCreate };

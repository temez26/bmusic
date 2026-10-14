const db = require("../../db");

const findAll = async () => {
  const { rows } = await db.query("SELECT * FROM artists ORDER BY name");
  return rows;
};

const findOrCreate = async (name) => {
  const existing = await db.query("SELECT id FROM artists WHERE name = $1", [
    name,
  ]);
  if (existing.rows[0]) return existing.rows[0].id;

  const { rows } = await db.query(
    "INSERT INTO artists (name) VALUES ($1) RETURNING id",
    [name]
  );
  return rows[0].id;
};

module.exports = { findAll, findOrCreate };

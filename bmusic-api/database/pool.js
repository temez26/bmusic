require("dotenv").config();
const { Pool } = require("pg");

// Create a new pool instance to manage PostgreSQL connections
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

module.exports = { pool };

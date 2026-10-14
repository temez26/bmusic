const path = require("path");
const dotenv = require("dotenv");

// Local runs read bmusic-api/.env first, then the repository root .env.
// Variables already set in the environment (e.g. by Docker Compose) win.
dotenv.config({
  path: [
    path.join(__dirname, "..", ".env"),
    path.join(__dirname, "..", "..", ".env"),
  ],
  quiet: true,
});

const dataDir = path.resolve(
  process.env.DATA_DIR || path.join(__dirname, "..", "data")
);

module.exports = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  db: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  paths: {
    data: dataDir,
    uploads: path.join(dataDir, "uploads"),
    covers: path.join(dataDir, "covers"),
  },
};

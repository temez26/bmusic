const fs = require("fs/promises");
const path = require("path");
const mm = require("music-metadata");
const songs = require("../songs/songs.repository");
const albums = require("../albums/albums.repository");
const artists = require("../artists/artists.repository");

// Paths are stored relative to the API root so they double as media URLs
// (e.g. "data/uploads/123.mp3" is served at GET /data/uploads/123.mp3).
const toStoredPath = (folder, file) => `data/${folder}/${file.filename}`;

const formatDuration = (seconds = 0) => {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
};

const importAudio = async (file, coverPath) => {
  const metadata = await mm.parseFile(file.path);
  const tags = metadata.common;

  const artist = tags.artist || "Unknown Artist";
  const album = tags.album || "Unknown Album";
  const genre = tags.genre && tags.genre.length ? tags.genre.join(", ") : null;

  const artistId = await artists.findOrCreate(artist);
  const albumId = await albums.findOrCreate({
    title: album,
    artistId,
    genre,
    coverPath,
  });

  await songs.create({
    title: tags.title || path.parse(file.originalname).name,
    artistId,
    albumId,
    artist,
    album,
    genre,
    filePath: toStoredPath("uploads", file),
    coverPath,
    length: formatDuration(metadata.format.duration),
  });
};

// Imports one batch of files. The last image in the batch becomes the cover
// for every album in it, so upload one album (folder) at a time.
const importFiles = async (files) => {
  const images = files.filter((f) => f.kind === "image");
  const cover = images[images.length - 1];
  const coverPath = cover ? toStoredPath("covers", cover) : null;

  const uploaded = [];
  const failed = [];

  for (const file of files.filter((f) => f.kind === "audio")) {
    try {
      await importAudio(file, coverPath);
      uploaded.push(file.originalname);
    } catch (err) {
      console.error(`Failed to import ${file.originalname}:`, err.message);
      failed.push({ file: file.originalname, error: err.message });
      await fs.rm(file.path, { force: true });
    }
  }

  return { uploaded, failed };
};

module.exports = { importFiles };

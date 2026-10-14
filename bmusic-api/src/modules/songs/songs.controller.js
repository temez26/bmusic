const fs = require("fs/promises");
const path = require("path");
const config = require("../../config");
const { HttpError, parseId } = require("../../shared/http");
const songs = require("./songs.repository");
const playlists = require("../playlists/playlists.repository");

const list = async (req, res) => {
  res.json(await songs.findAll());
};

const remove = async (req, res) => {
  const id = parseId(req.params.id);
  const song = await songs.findById(id);
  if (!song) throw new HttpError(404, "Song not found");

  await songs.remove(id);
  // file_path is stored as "data/uploads/<file>"; only the basename is trusted.
  const filePath = path.join(config.paths.uploads, path.basename(song.file_path));
  await fs.rm(filePath, { force: true });

  res.status(204).end();
};

const recordPlay = async (req, res) => {
  const id = parseId(req.params.id);
  const playCount = await songs.incrementPlayCount(id);
  if (playCount === null) throw new HttpError(404, "Song not found");
  res.json({ playCount });
};

const listPlaylistIds = async (req, res) => {
  res.json(await playlists.findIdsBySong(parseId(req.params.id)));
};

module.exports = { list, remove, recordPlay, listPlaylistIds };

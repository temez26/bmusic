const { HttpError, parseId } = require("../../shared/http");
const playlists = require("./playlists.repository");

const requirePlaylist = async (id) => {
  const playlist = await playlists.findById(id);
  if (!playlist) throw new HttpError(404, "Playlist not found");
  return playlist;
};

const list = async (req, res) => {
  res.json(await playlists.findAll());
};

const get = async (req, res) => {
  res.json(await requirePlaylist(parseId(req.params.id)));
};

const create = async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  if (!name) throw new HttpError(400, "Playlist name is required");
  const description = req.body.description || null;
  res.status(201).json(await playlists.create({ name, description }));
};

const remove = async (req, res) => {
  const playlist = await requirePlaylist(parseId(req.params.id));
  if (playlist.protected) {
    throw new HttpError(409, "Protected playlist cannot be deleted");
  }
  await playlists.remove(playlist.id);
  res.status(204).end();
};

const listSongs = async (req, res) => {
  const playlist = await requirePlaylist(parseId(req.params.id));
  res.json(await playlists.findSongs(playlist.id));
};

const addSong = async (req, res) => {
  const playlistId = parseId(req.params.id);
  const songId = parseId(req.body.songId, "songId");
  await requirePlaylist(playlistId);
  await playlists.addSong(playlistId, songId);
  res.status(204).end();
};

const removeSong = async (req, res) => {
  const playlistId = parseId(req.params.id);
  const songId = parseId(req.params.songId, "songId");
  const removed = await playlists.removeSong(playlistId, songId);
  if (!removed) throw new HttpError(404, "Song is not in this playlist");
  res.status(204).end();
};

module.exports = { list, get, create, remove, listSongs, addSong, removeSong };

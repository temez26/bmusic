const { pool } = require("./pool");
// --- New Playlist Functions ---
const createPlaylist = async (name, description, created_by) => {
  try {
    const result = await pool.query(
      "INSERT INTO playlists (name, description, created_by) VALUES ($1, $2, $3) RETURNING *",
      [name, description, created_by]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating playlist:", err);
    throw err;
  }
};

const addSongToPlaylist = async (playlist_id, song_id) => {
  try {
    const result = await pool.query(
      "INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2) RETURNING *",
      [playlist_id, song_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error(
      `Error adding song ${song_id} to playlist ${playlist_id}:`,
      err
    );
    throw err;
  }
};

const removeSongFromPlaylist = async (playlist_id, song_id) => {
  try {
    const result = await pool.query(
      "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING *",
      [playlist_id, song_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error(
      `Error removing song ${song_id} from playlist ${playlist_id}:`,
      err
    );
    throw err;
  }
};

const getPlaylistSongs = async (playlist_id) => {
  try {
    const result = await pool.query(
      `SELECT s.* FROM songs s
       JOIN playlist_songs ps ON s.id = ps.song_id
       WHERE ps.playlist_id = $1`,
      [playlist_id]
    );
    return result.rows;
  } catch (err) {
    console.error(`Error fetching songs for playlist ${playlist_id}:`, err);
    throw err;
  }
};

const deletePlaylist = async (playlist_id) => {
  try {
    const result = await pool.query(
      `DELETE FROM playlists WHERE id = $1 RETURNING *`,
      [playlist_id]
    );
    return result.rows;
  } catch (err) {
    console.error(`Error deleting playlist ${playlist_id}:`, err);
    throw err;
  }
};

const getAllPlaylists = async () => {
  try {
    const result = await pool.query("SELECT * FROM playlists");
    return result.rows;
  } catch (err) {
    console.error("Error fetching all playlists:", err);
    throw err;
  }
};

// Export all functions for use in other modules
module.exports = {
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getPlaylistSongs,
  getAllPlaylists,
  deletePlaylist,
};

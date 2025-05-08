const { pool } = require("./pool");
// Function to insert a new song into the database
const insertSong = async (
  title,
  artist_id,
  album_id,
  artist,
  album,
  genre,
  file_path,
  album_cover_url,
  length
) => {
  try {
    const result = await pool.query(
      "INSERT INTO songs (title, artist_id, album_id, artist, album, genre, file_path, album_cover_url, length) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        title,
        artist_id,
        album_id,
        artist,
        album,
        genre,
        file_path,
        album_cover_url,
        length,
      ]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error inserting song:", err);
    throw err;
  }
};

// Function to fetch songs from the database with options for sorting and limiting
const getAllSongs = async (options = {}) => {
  try {
    let query = "SELECT * FROM songs";
    const params = [];

    // Add WHERE clauses if needed

    // Add ORDER BY clause if sort parameter is provided
    if (options.sort) {
      // Security: Whitelist allowed columns to prevent SQL injection
      const allowedColumns = [
        "title",
        "artist",
        "album",
        "play_count",
        "created_at",
      ];
      const sortColumn = allowedColumns.includes(options.sort)
        ? options.sort
        : "id";

      query += ` ORDER BY ${sortColumn}`;

      // Add sorting direction (default to DESC for play_count, ASC for others)
      if (options.sort === "play_count") {
        query += options.order?.toUpperCase() === "ASC" ? " ASC" : " DESC";
      } else {
        query += options.order?.toUpperCase() === "DESC" ? " DESC" : " ASC";
      }
    }

    // Add LIMIT clause if limit parameter is provided
    if (options.limit && !isNaN(options.limit) && parseInt(options.limit) > 0) {
      query += " LIMIT $1";
      params.push(parseInt(options.limit));
    }

    const result = await pool.query(query, params);
    return result.rows;
  } catch (err) {
    console.error("Error fetching songs:", err);
    throw err;
  }
};

// Function to fetch a song by its ID from the database
const getSongById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM songs WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error(`Error fetching song with id ${id}:`, err);
    throw err;
  }
};

// Function to delete a song by its ID from the database
const deleteSong = async (id) => {
  try {
    const result = await pool.query("DELETE FROM songs WHERE id = $1", [id]);
    return result.rowCount;
  } catch (err) {
    console.error("Error deleting song:", err);
    throw err;
  }
};

// Function to increment the play count of a song
const incrementPlayCount = async (id) => {
  try {
    const result = await pool.query(
      "UPDATE songs SET play_count = play_count + 1 WHERE id = $1 RETURNING play_count",
      [id]
    );
    return result.rows[0].play_count;
  } catch (err) {
    console.error(`Error incrementing play count for song id ${id}:`, err);
    throw err;
  }
};

// Function to get or insert an artist
const getOrInsertArtist = async (artistName) => {
  try {
    const result = await pool.query("SELECT id FROM artists WHERE name = $1", [
      artistName,
    ]);
    if (result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      const insertResult = await pool.query(
        "INSERT INTO artists (name) VALUES ($1) RETURNING id",
        [artistName]
      );
      return insertResult.rows[0].id;
    }
  } catch (err) {
    console.error(`Error getting or inserting artist "${artistName}":`, err);
    throw err;
  }
};

// function to get all artists with their songs
const getAllArtists = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        json_agg(
          json_build_object(
            'id', s.id,
            'title', s.title,
            'album', s.album,
            'genre', s.genre,
            'file_path', s.file_path,
            'album_cover_url', s.album_cover_url,
            'length', s.length,
            'upload_date', s.upload_date,
            'play_count', s.play_count
          )
        ) FILTER (WHERE s.id IS NOT NULL) AS songs
      FROM 
        artists a
      LEFT JOIN 
        songs s ON a.id = s.artist_id
      GROUP BY 
        a.id
      ORDER BY
        a.name ASC
    `);

    return result.rows.map((artist) => ({
      ...artist,
      songs: artist.songs || [],
    }));
  } catch (err) {
    console.error("Error fetching all artists with songs:", err);
    throw err;
  }
};

// function to get all albums with their songs
const getAllAlbums = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        alb.*,
        json_agg(
          json_build_object(
            'id', s.id,
            'title', s.title,
            'artist', s.artist,
            'genre', s.genre,
            'file_path', s.file_path,
            'album_cover_url', s.album_cover_url,
            'length', s.length,
            'upload_date', s.upload_date,
            'play_count', s.play_count
          )
        ) FILTER (WHERE s.id IS NOT NULL) AS songs
      FROM 
        albums alb
      LEFT JOIN 
        songs s ON alb.id = s.album_id
      GROUP BY 
        alb.id
      ORDER BY
        alb.title ASC
    `);

    return result.rows.map((album) => ({
      ...album,
      songs: album.songs || [],
    }));
  } catch (err) {
    console.error("Error fetching all albums with songs:", err);
    throw err;
  }
};

// Function to get or insert an album
const getOrInsertAlbum = async (
  albumTitle,
  artist_id,
  genre,
  cover_image_url
) => {
  try {
    const result = await pool.query(
      "SELECT id FROM albums WHERE title = $1 AND artist_id = $2",
      [albumTitle, artist_id]
    );
    if (result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      const insertResult = await pool.query(
        "INSERT INTO albums (title, artist_id, genre, cover_image_url) VALUES ($1, $2, $3, $4) RETURNING id",
        [albumTitle, artist_id, genre, cover_image_url]
      );
      return insertResult.rows[0].id;
    }
  } catch (err) {
    console.error(`Error getting or inserting album "${albumTitle}":`, err);
    throw err;
  }
};

// Export all functions for use in other modules
module.exports = {
  insertSong,
  getAllSongs,
  getAllArtists,
  getAllAlbums,
  getSongById,
  deleteSong,
  incrementPlayCount,
  getOrInsertArtist,
  getOrInsertAlbum,
};

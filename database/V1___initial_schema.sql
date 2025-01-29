
-- Artists Table
CREATE TABLE artists (
id SERIAL PRIMARY KEY,
name VARCHAR(255)
);

-- Albums Table
CREATE TABLE albums (
id SERIAL PRIMARY KEY,
title VARCHAR(255),
artist_id INT REFERENCES artists(id),
genre VARCHAR(255),
cover_image_url VARCHAR(255)
);

-- Songs Table
CREATE TABLE songs (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
artist_id INT REFERENCES artists(id),
album_id INT REFERENCES albums(id),
album VARCHAR(255),
artist VARCHAR(255),
genre VARCHAR(255),
file_path VARCHAR(255) NOT NULL,
album_cover_url VARCHAR(255),
length VARCHAR(10),
upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
play_count INT DEFAULT 0
);

-- Playlists Table
CREATE TABLE playlists (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT,
created_by INT,
creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlist Songs Table (Join Table)
CREATE TABLE playlist_songs (
playlist_id INT REFERENCES playlists(id),
song_id INT REFERENCES songs(id),
PRIMARY KEY (playlist_id, song_id)
);

# possible future schema

-- Artists Table
CREATE TABLE artists (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
genre VARCHAR(255),
biography TEXT,
profile_image_url VARCHAR(255),
debut_date DATE
);

-- Albums Table
CREATE TABLE albums (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
artist_id INT REFERENCES artists(id),
genre VARCHAR(255),
release_date DATE,
cover_image_url VARCHAR(255),
track_count INT
);

-- Songs Table
CREATE TABLE songs (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
artist_id INT REFERENCES artists(id),
album_id INT REFERENCES albums(id),
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

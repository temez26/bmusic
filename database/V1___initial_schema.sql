
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

-- Playlists Table with a "protected" column
CREATE TABLE playlists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INT,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  protected BOOLEAN DEFAULT FALSE,
  UNIQUE (name)
);

-- Playlist Songs Table (Join Table)
CREATE TABLE playlist_songs (
  playlist_id INT REFERENCES playlists(id) ON DELETE CASCADE,
  song_id INT REFERENCES songs(id) ON DELETE CASCADE,
  PRIMARY KEY (playlist_id, song_id)
);

-- Insert Default "Favorites" Playlist marked as protected if it doesn't exist
INSERT INTO playlists (name, description, created_by, protected)
VALUES ('Favorites', 'Default favorites playlist', NULL, TRUE)
ON CONFLICT (name) DO NOTHING;

-- Create trigger function to prevent deletion of protected playlists
CREATE OR REPLACE FUNCTION prevent_delete_protected_playlist()
RETURNS trigger AS $$
BEGIN
  IF OLD.protected THEN
    RAISE EXCEPTION 'Protected playlist cannot be deleted';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for the playlists table
CREATE TRIGGER trigger_protected_playlist
BEFORE DELETE ON playlists
FOR EACH ROW EXECUTE FUNCTION prevent_delete_protected_playlist();
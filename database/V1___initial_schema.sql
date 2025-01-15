CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    album VARCHAR(255),
    genre VARCHAR(255),
    file_path VARCHAR(255) NOT NULL,
    album_cover_url VARCHAR(255), 
    length VARCHAR(10),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
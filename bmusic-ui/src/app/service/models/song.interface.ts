export interface Song {
  id: number;
  title: string;
  artist_id: number;
  album_id: number;
  artist: string;
  album: string;
  genre: string;
  file_path: string;
  album_cover_url: string;
  play_count: number;
  upload_date: string;
  length: string;
}

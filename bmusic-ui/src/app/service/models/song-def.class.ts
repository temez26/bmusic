export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  file_path: string;
  album_cover_url: string;
  play_count: number;
  upload_date: string;
}
export interface UploadResponse {
  songs: Song[];
}

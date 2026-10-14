export interface Song {
  id: number;
  title: string;
  artist_id: number;
  album_id: number;
  artist: string;
  album: string;
  genre: string | null;
  file_path: string;
  album_cover_url: string | null;
  play_count: number;
  upload_date: string;
  length: string;
}

/** Older rows stored genre arrays as Postgres literals like {"Rock"}. */
export const formatGenre = (genre: string | null): string =>
  (genre ?? '').replace(/[{}"]/g, '');

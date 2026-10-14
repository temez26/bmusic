export interface Album {
  id: number;
  title: string;
  artist_id: number;
  genre: string | null;
  cover_image_url: string | null;
}

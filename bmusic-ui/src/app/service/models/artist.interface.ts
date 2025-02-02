export interface Artists {
  id: number;
  artistId: number;
  name: string;
}
export interface CurrentArtist extends Artists {
  current_artist_id: number;
  artworkUrl100?: string;
}

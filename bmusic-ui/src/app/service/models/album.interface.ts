export interface Albums {
  id: number;
  title: string;
  artist_id: number;
  genre: string;
  songs: [];
  cover_image_url: string;
}

export interface CurrentAlbum extends Albums {
  current_album_id: number;
}

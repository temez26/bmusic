import { Song } from './song.interface';

export interface Albums {
  id: number;
  title: string;
  artist_id: number;
  genre: string;
  songs: Song[];
  cover_image_url: string;
}

export interface CurrentAlbum extends Albums {
  current_album_id: number;
}

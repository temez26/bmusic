import { Song } from './song.interface';

export interface Playlist {
  id: number;
  songs: Song[];
  name: string;
  description: string;
  created_by: number;
  creation_date?: string;
  imgUrl: string;
}

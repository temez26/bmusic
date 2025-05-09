import { Song } from './song.interface';

export interface Artists {
  id: number;
  name: string;
  songs: Song[];
}

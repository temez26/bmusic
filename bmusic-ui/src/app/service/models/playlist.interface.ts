export interface Playlist {
  id: number;
  name: string;
  description: string;
  songIds: number[];
  createdBy: number;
  creationDate: string;
}

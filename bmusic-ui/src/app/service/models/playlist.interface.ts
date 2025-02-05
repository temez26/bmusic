export interface Playlist {
  id: number;
  songIds: number[];
  name: string;
  description: string;
  created_by: number;
  creation_date?: string;
  imgUrl: string;
}

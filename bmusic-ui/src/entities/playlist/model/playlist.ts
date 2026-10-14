export interface Playlist {
  id: number;
  name: string;
  description: string | null;
  creation_date: string;
  /** The built-in Favorites playlist is protected and cannot be deleted. */
  protected: boolean;
}

export const playlistImage = (playlist: Playlist): string =>
  playlist.protected ? '/favorites.png' : '/playlists.png';

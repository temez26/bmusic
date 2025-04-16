import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../../service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistStateService {
  private currentPlaylistSubject: BehaviorSubject<Song[]>;
  public currentPlaylist$: Observable<Song[]>;

  // Constructor: Initializes the BehaviorSubject with any stored playlist from sessionStorage.
  constructor() {
    const savedPlaylist = sessionStorage.getItem('currentPlaylist');
    const initialPlaylist: Song[] = savedPlaylist
      ? JSON.parse(savedPlaylist)
      : [];
    this.currentPlaylistSubject = new BehaviorSubject<Song[]>(initialPlaylist);
    this.currentPlaylist$ = this.currentPlaylistSubject.asObservable();

    this.currentPlaylistSubject.subscribe((songs) => {
      sessionStorage.setItem('currentPlaylist', JSON.stringify(songs));
    });
  }

  // getSongsByPlaylistIds: Filters the given songs by the provided specificIds,
  // updates the current playlist, and returns the filtered songs.
  getSongsByPlaylistIds(specificIds: number[], songs: Song[]): Song[] {
    const playlistSongs = specificIds
      .map((id) => songs.find((song) => song.id === id))
      .filter((song): song is Song => !!song);
    this.currentPlaylistSubject.next(playlistSongs);

    return playlistSongs;
  }

  // setCurrentPlaylistSongs: Replaces the current playlist with a new list of songs.
  setCurrentPlaylistSongs(songs: Song[]): void {
    this.currentPlaylistSubject.next([...songs]);
  }
}

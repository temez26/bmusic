import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../models/song.interface';
import { SongsStateService } from './songs.state.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private currentPlaylistSubject: BehaviorSubject<Song[]>;
  public currentPlaylist$: Observable<Song[]>;

  private playlistSongs: Song[] = [];

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

  getSongsByPlaylistIds(specificIds: number[], songs: Song[]): Song[] {
    const foundSongs = specificIds
      .map((id) => songs.find((song) => song.id === id))
      .filter((song): song is Song => !!song);
    this.currentPlaylistSubject.next(foundSongs);
    console.log('Stored playlist songs in currentPlaylistSubject:', foundSongs);
    return foundSongs;
  }

  getPlaylistSongs(): Song[] {
    return this.playlistSongs;
  }

  clearPlaylistSongs(): void {
    this.playlistSongs = [];
  }

  setCurrentPlaylistSongs(songs: Song[]): void {
    this.currentPlaylistSubject.next([...songs]);
  }

  getCurrentPlaylistSongs(): Song[] {
    return this.currentPlaylistSubject.getValue();
  }
}

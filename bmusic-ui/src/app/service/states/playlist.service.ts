import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Playlist } from '../models/playlist.interface';

@Injectable({
  providedIn: 'root',
})
export class PlaylistStateService {
  private currentPlaylistSubject: BehaviorSubject<Playlist | null>;
  public currentPlaylist$: Observable<Playlist | null>;

  constructor() {
    const savedPlaylist = sessionStorage.getItem('currentPlaylist');
    const initialPlaylist: Playlist | null = savedPlaylist
      ? JSON.parse(savedPlaylist)
      : null;

    this.currentPlaylistSubject = new BehaviorSubject<Playlist | null>(
      initialPlaylist
    );
    this.currentPlaylist$ = this.currentPlaylistSubject.asObservable();

    this.currentPlaylistSubject.subscribe((playlist) => {
      sessionStorage.setItem('currentPlaylist', JSON.stringify(playlist));
    });
  }

  getCurrentPlaylist(): Playlist | null {
    return this.currentPlaylistSubject.getValue();
  }

  setCurrentPlaylist(playlist: Playlist): void {
    this.currentPlaylistSubject.next(playlist);
  }

  clearCurrentPlaylist(): void {
    this.currentPlaylistSubject.next(null);
  }
}

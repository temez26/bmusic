import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song, PlayerService } from '../../service';

@Injectable({
  providedIn: 'root',
})
export class SongsStateService {
  private songsSubject = new BehaviorSubject<Song[]>([]);
  public songs$ = this.songsSubject.asObservable();

  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  public currentSong$ = this.currentSongSubject.asObservable();

  constructor(private playerService: PlayerService) {}

  setSongs(songs: Song[]): void {
    this.songsSubject.next([...songs]);
  }

  setCurrentSong(song: Song): void {
    this.currentSongSubject.next({ ...song });
  }

  setCurrentSongById(songId: number): void {
    const songs = this.songsSubject.getValue();
    const song = songs.find((s) => s.id === songId);

    if (!song) {
      console.error('Song not found with id in the current playlist:', songId);
      return;
    }

    // Update the current song in state
    this.currentSongSubject.next({ ...song });

    // Update all player properties at once
    this.playerService.updateWithSongDetails(song);
  }
}

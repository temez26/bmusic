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

  constructor(private playerService: PlayerService) {
    // track who is the main device
  }

  setSongs(songs: Song[]): void {
    this.songsSubject.next([...songs]);
  }

  setCurrentSong(song: Song): void {
    this.currentSongSubject.next({ ...song });
  }

  private updateSongDetails(song: Song): void {
    this.setCurrentSong(song);
    this.playerService.updateTitle(song.title);
    this.playerService.updateFilePath(song.file_path);
    this.playerService.updateCoverPath(song.album_cover_url);
    this.playerService.updateArtistPath(song.artist);
    this.playerService.updateSongId(song.id);
    this.playerService.updateIsPlaying(true);
  }

  setCurrentSongById(songId: number): void {
    // Now, if a playlist song is needed, you can delegate to PlaylistService methods
    let song;
    let currentPlaylist;

    if (!song) {
      currentPlaylist = this.songsSubject.getValue();
      song = currentPlaylist.find((s) => s.id === songId);
    }
    this.playerService.updateAudioDuration(0);
    this.playerService.updateCurrentTime(0);
    if (song) {
      this.updateSongDetails(song);
    } else {
      console.error('Song not found with id in the current playlist:', songId);
    }
  }
}

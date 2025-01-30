import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../models/song.interface';
import { PlayerService } from '../player/player.service';

@Injectable({
  providedIn: 'root',
})
// Handles Song data that is fetched from the server
export class SongsStateService {
  constructor(private playerService: PlayerService) {}
  private songsSubject = new BehaviorSubject<Song[]>([]);
  public songs$: Observable<Song[]> = this.songsSubject.asObservable();

  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  public currentSong$: Observable<Song | null> =
    this.currentSongSubject.asObservable();

  updateSong(updatedSong: Song): void {
    const currentSongs = this.songsSubject.getValue();

    const updatedSongs = currentSongs.map((song) =>
      song.id === updatedSong.id
        ? { ...song, play_count: updatedSong.play_count }
        : song
    );
    this.songsSubject.next(updatedSongs);
  }

  sortSongs(criteria: 'play_count' | 'id'): Song[] {
    const songs = this.getSongs();
    if (criteria === 'play_count') {
      return songs.sort((a, b) => b.play_count - a.play_count).slice(0, 15);
    } else if (criteria === 'id') {
      return songs.sort((a, b) => a.id - b.id);
    }
    return songs;
  }

  setSongs(songs: Song[]): void {
    this.songsSubject.next([...songs]);
  }

  getSongs(): Song[] {
    return this.songsSubject.getValue();
  }

  setCurrentSong(song: Song): void {
    this.currentSongSubject.next({ ...song });
  }

  getCurrentSong(): Song | null {
    return this.currentSongSubject.getValue();
  }

  getSongsByAlbumId(albumId: number): Song[] {
    return this.getSongs().filter((song) => song.album_id === albumId);
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
    const song = this.getSongs().find((s) => s.id === songId);
    this.playerService.updateAudioDuration(0);
    this.playerService.updateCurrentTime(0);
    if (song) {
      this.updateSongDetails(song);
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        audioElement.currentTime = 0;
      }
    } else {
      console.error('Song not found with id:', songId);
    }
  }
}

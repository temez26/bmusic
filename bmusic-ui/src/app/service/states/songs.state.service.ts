import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../models/song.interface';
import { PlayerService } from '../player/player.service';
import { PlaylistService } from './playlist.service';

@Injectable({
  providedIn: 'root',
})
export class SongsStateService {
  private songsSubject = new BehaviorSubject<Song[]>([]);
  public songs$: Observable<Song[]> = this.songsSubject.asObservable();

  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  public currentSong$: Observable<Song | null> =
    this.currentSongSubject.asObservable();

  constructor(
    private playerService: PlayerService,
    private playlistService: PlaylistService
  ) {}

  updateSong(updatedSong: Song): void {
    const currentSongs = this.songsSubject.getValue();
    const updatedSongs = currentSongs.map((song) =>
      song.id === updatedSong.id
        ? { ...song, play_count: updatedSong.play_count }
        : song
    );
    this.songsSubject.next(updatedSongs);
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
    // Now, if a playlist song is needed, you can delegate to PlaylistService methods
    let currentPlaylist = this.playlistService.getCurrentPlaylistSongs();
    let song = currentPlaylist.find((s) => s.id === songId);
    if (!song) {
      currentPlaylist = this.getSongs();
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

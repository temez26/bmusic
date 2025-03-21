import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Song } from '../models/song.interface';
import { PlayerService } from '../player/player.service';

@Injectable({
  providedIn: 'root',
})
// Handles Song data that is fetched from the server
export class SongsStateService {
  private songsSubject = new BehaviorSubject<Song[]>([]);
  public songs$: Observable<Song[]> = this.songsSubject.asObservable();

  private currentPlaylistSubject: BehaviorSubject<Song[]>;
  public currentPlaylist$: Observable<Song[]>;

  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  public currentSong$: Observable<Song | null> =
    this.currentSongSubject.asObservable();

  private playlistSongs: Song[] = [];

  constructor(private playerService: PlayerService) {
    const savedPlaylist = sessionStorage.getItem('currentPlaylist');
    const initialPlaylist = savedPlaylist ? JSON.parse(savedPlaylist) : [];
    this.currentPlaylistSubject = new BehaviorSubject<Song[]>(initialPlaylist);
    this.currentPlaylist$ = this.currentPlaylistSubject.asObservable();
    this.currentPlaylistSubject.subscribe((songs) => {
      sessionStorage.setItem('currentPlaylist', JSON.stringify(songs));
    });
  }

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

  getSongsByPlaylistIds(specificIds: number[]): Song[] {
    const songs = this.getSongs();
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

  setSongs(songs: Song[]): void {
    this.songsSubject.next([...songs]);
  }

  clearPlaylistSongs(): void {
    this.playlistSongs = [];
  }

  setCurrentPlaylistSongs(songs: Song[]): void {
    console.log(songs);
    this.currentPlaylistSubject.next([...songs]);
  }

  getCurrentPlaylistSongs(): Song[] {
    return this.currentPlaylistSubject.getValue();
  }

  getSongs(): Song[] {
    return this.songsSubject.getValue();
  }

  searchSongs(query: string): Observable<Song[]> {
    if (!query.trim()) {
      return of(this.getSongs());
    }
    const lowerQuery = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const tokens = lowerQuery.split(/\s+/).filter((token) => token.length);

    const filtered = this.getSongs().filter((song) => {
      const title = song.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const artist = song.artist
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const album = song.album
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return tokens.every(
        (token) =>
          title.includes(token) ||
          artist.includes(token) ||
          album.includes(token)
      );
    });
    console.log(filtered);
    return of(filtered);
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
    let currentPlaylist = this.getCurrentPlaylistSongs();
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

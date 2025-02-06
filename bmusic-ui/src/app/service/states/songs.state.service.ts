import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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

  private playlistSongs: Song[] = [];

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

  // New function to get songs based on a list of playlist IDs and store them separately.
  getSongsByPlaylistIds(specificIds: number[]): Song[] {
    const songs = this.getSongs();
    const foundSongs = specificIds
      .map((id) => songs.find((song) => song.id === id))
      .filter((song): song is Song => !!song);
    this.playlistSongs = foundSongs;
    console.log('Stored playlist songs:', this.playlistSongs);
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

  getSongs(): Song[] {
    return this.songsSubject.getValue();
  }
  // for search bar filtering
  searchSongs(query: string): Observable<Song[]> {
    // Return all songs if query is empty (optional behavior)
    if (!query.trim()) {
      return of(this.getSongs());
    }

    const lowerQuery = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    // Split the query into tokens for multi-word searches
    const tokens = lowerQuery.split(/\s+/).filter((token) => token.length);

    const filtered = this.getSongs().filter((song) => {
      // Normalize song fields to support diacritics insensitive search
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

      // All tokens must appear in at least one of the fields for a match
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
    const song = this.getSongs().find((s) => s.id === songId);
    this.playerService.updateAudioDuration(0);
    this.playerService.updateCurrentTime(0);
    if (song) {
      this.updateSongDetails(song);
    } else {
      console.error('Song not found with id:', songId);
    }
  }
}

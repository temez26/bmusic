import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SongsStateService, Song } from '../../../service';

@Injectable({
  providedIn: 'root',
})
export class SongSearchService {
  songs!: Song[];
  constructor(private songsStateService: SongsStateService) {}

  searchSongs(query: string): Observable<Song[]> {
    this.songsStateService.songs$.subscribe((songs) => {
      this.songs = songs;
    });
    const songs = this.songs;
    if (!query.trim()) {
      return of(songs);
    }
    const lowerQuery = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const tokens = lowerQuery.split(/\s+/).filter((token) => token.length);

    const filtered = songs.filter((song) => {
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
    return of(filtered);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Song } from './models/song.interface';
import { Album } from './models/album.interface';
import { Artist } from './models/artist.interface';
import { ArtistStateService } from './states/artist.state.service';
import { PlayerStateService } from './states/player.state.service';
import { AlbumStateService } from './states/album.state.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = `http://127.0.0.1:4000`;

  constructor(
    private http: HttpClient,
    private stateService: PlayerStateService,
    private albumService: AlbumStateService,
    private artistService: ArtistStateService
  ) {}

  incrementPlayCount(songId: number): Observable<{ playCount: number }> {
    const url = `${this.baseUrl}/increment`;
    return this.http.post<{ playCount: number }>(url, { id: songId }).pipe(
      tap((response) => {
        const updatedPlayCount = response.playCount;
        const song = this.stateService.getSongs().find((s) => s.id === songId);
        console.log(song);
        if (song) {
          this.stateService.updateSong({
            ...song,
            play_count: updatedPlayCount,
          });
        }
      }),
      catchError((error) => {
        console.error('Error incrementing play count:', error);
        return throwError(() => error);
      })
    );
  }
  fetchSongs(): Observable<Song[]> {
    const url = `${this.baseUrl}/songs`;
    return this.http.get<Song[]>(url).pipe(
      tap((fetchedSongs: Song[]) => {
        this.stateService.setSongs(fetchedSongs);
      }),
      catchError((error) => {
        console.error('Error fetching songs:', error);
        return throwError(() => error);
      })
    );
  }
  fetchArtists(): Observable<Artist[]> {
    const url = `${this.baseUrl}/artists`;
    return this.http.get<Artist[]>(url).pipe(
      tap((fetchedArtists: Artist[]) => {
        this.artistService.setArtists(fetchedArtists);
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }
  fetchAlbums(): Observable<Album[]> {
    const url = `${this.baseUrl}/albums`;
    return this.http.get<Album[]>(url).pipe(
      tap((fetchedAlbums: Album[]) => {
        this.albumService.setAlbums(fetchedAlbums);
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }

  deleteSong(songId: number): Observable<Song[]> {
    const url = `${this.baseUrl}/delete`;
    return this.http.delete<Song[]>(url, { body: { id: songId } }).pipe(
      tap((updatedSongs: Song[]) => {
        this.stateService.setSongs(updatedSongs);
      }),
      catchError((error) => {
        console.error('Error deleting song:', error);
        return throwError(() => error);
      })
    );
  }
  uploadFiles(files: File[]): Observable<{ songs: Song[] }> {
    const url = `${this.baseUrl}/upload`;
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.http.post<{ songs: Song[] }>(url, formData).pipe(
      tap((response) => {
        if (response.songs) {
          console.log(response.songs);
          this.stateService.setSongs(response.songs);
        }
      }),
      catchError((error) => {
        console.error('Error uploading files:', error);
        return throwError(() => error);
      })
    );
  }
}

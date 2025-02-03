import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Song } from './models/song.interface';
import { environment } from '../../environments/environment';
import { Playlist } from './models/playlist.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiPlaylistService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  createPlaylist(
    name: string,
    description: string,
    created_by: number
  ): Observable<Playlist> {
    const url = `${this.baseUrl}playlists`;
    return this.http
      .post<Playlist>(url, { name, description, created_by })
      .pipe(
        catchError((error) => {
          console.error('Error creating playlist:', error);
          return throwError(() => error);
        })
      );
  }

  addSongToPlaylist(playlistId: number, song_id: number) {
    const url = `${this.baseUrl}playlists/${playlistId}/songs`;
    return this.http.post(url, { song_id }).pipe(
      catchError((error) => {
        console.error('Error adding song to playlist:', error);
        return throwError(() => error);
      })
    );
  }

  removeSongFromPlaylist(playlistId: number, song_id: number) {
    const url = `${this.baseUrl}playlists/${playlistId}/songs/${song_id}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Error removing song from playlist:', error);
        return throwError(() => error);
      })
    );
  }

  fetchPlaylistSongs(playlistId: number): Observable<Song[]> {
    const url = `${this.baseUrl}playlists/${playlistId}/songs`;
    return this.http.get<Song[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching playlist songs:', error);
        return throwError(() => error);
      })
    );
  }

  fetchPlaylists(): Observable<Playlist[]> {
    const url = `${this.baseUrl}playlists`;
    return this.http.get<Playlist[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching playlists:', error);
        return throwError(() => error);
      })
    );
  }
}

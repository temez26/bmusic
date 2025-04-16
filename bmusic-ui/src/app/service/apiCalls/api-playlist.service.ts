import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable, tap, catchError } from 'rxjs';
import { ApiService, Playlist, Song } from '../../service';

@Injectable({
  providedIn: 'root',
})
export class ApiPlaylistService {
  constructor(private http: HttpClient, private api: ApiService) {}

  createPlaylist(
    name: string,
    description: string,
    created_by: number
  ): Observable<Playlist> {
    const url = `${this.api.baseUrl}playlists`;
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
    const url = `${this.api.baseUrl}playlists/${playlistId}/songs`;
    return this.http.post(url, { song_id }).pipe(
      catchError((error) => {
        console.error('Error adding song to playlist:', error);
        return throwError(() => error);
      })
    );
  }

  removeSongFromPlaylist(playlistId: number, song_id: number) {
    const url = `${this.api.baseUrl}playlists/${playlistId}/songs/${song_id}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Error removing song from playlist:', error);
        return throwError(() => error);
      })
    );
  }

  fetchPlaylistSongs(playlistId: number): Observable<Song[]> {
    const url = `${this.api.baseUrl}playlists/${playlistId}/songs`;
    return this.http.get<Song[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching playlist songs:', error);
        return throwError(() => error);
      })
    );
  }

  deletePlaylist(playlistId: number) {
    const url = `${this.api.baseUrl}playlists/${playlistId}`;
    return this.http.delete(url).pipe(
      tap(() =>
        console.log(`Successfully deleted playlist with ID: ${playlistId}`)
      ),
      catchError((error) => {
        console.error('Error removing song from playlist:', error);
        return throwError(() => error);
      })
    );
  }
  fetchPlaylists(): Observable<Playlist[]> {
    const url = `${this.api.baseUrl}playlists`;
    return this.http.get<Playlist[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching playlists:', error);
        return throwError(() => error);
      })
    );
  }
}

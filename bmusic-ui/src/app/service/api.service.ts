import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Song } from './models/song.model';
import { PlayerStateService } from './player.state.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = `http://127.0.0.1:4000`;

  constructor(
    private http: HttpClient,
    private stateService: PlayerStateService
  ) {}

  incrementPlayCount(songId: number): Observable<{ playCount: number }> {
    const url = `${this.baseUrl}/increment`;
    return this.http.post<{ playCount: number }>(url, { id: songId }).pipe(
      tap((response) => {
        const updatedPlayCount = response.playCount;
        const currentSongs = this.stateService.getSongs();
        const updatedSongs = currentSongs.map((song) =>
          song.id === songId ? { ...song, play_count: updatedPlayCount } : song
        );
        this.stateService.setSongs(updatedSongs);
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

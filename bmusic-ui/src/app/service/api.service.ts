import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Song, UploadResponse } from './models/song-def.class';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  incrementPlayCount(songId: number): Observable<{ playCount: number }> {
    const url = `http://${window.location.hostname}:4000/increment`;
    return this.http.post<{ playCount: number }>(url, { id: songId }).pipe(
      catchError((error) => {
        console.error('Error incrementing play count:', error);
        return throwError(() => error);
      })
    );
  }

  fetchSongs(): Observable<Song[]> {
    return this.http
      .get<Song[]>(`http://${window.location.hostname}:4000/songs`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching songs:', error);
          return throwError(() => error);
        })
      );
  }

  deleteSong(songId: number): Observable<Song[]> {
    const url = `http://${window.location.hostname}:4000/delete`;
    return this.http.delete<Song[]>(url, { body: { id: songId } }).pipe(
      catchError((error) => {
        console.error('Error deleting song:', error);
        return throwError(() => error);
      })
    );
  }

  uploadFiles(files: File[]): Observable<UploadResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.http
      .post<UploadResponse>(
        `http://${window.location.hostname}:4000/upload`,
        formData
      )
      .pipe(
        catchError((error) => {
          console.error('Error uploading files:', error);
          return throwError(() => error);
        })
      );
  }
}

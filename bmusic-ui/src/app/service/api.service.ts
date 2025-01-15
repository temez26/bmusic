import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Song, UploadResponse } from './models/song-def.class';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  incrementPlayCount(songId: number): Observable<{ playCount: number }> {
    const url = `http://${window.location.hostname}:4000/increment`;
    return this.http.post<{ playCount: number }>(url, { id: songId }).pipe(
      tap((response) => {
        console.log('Incremented play count:', response.playCount);
      })
    );
  }
  fetchSongs(): Observable<Song[]> {
    return this.http
      .get<Song[]>(`http://${window.location.hostname}:4000/songs`)
      .pipe(
        tap((songs) => {
          console.log('Fetched songs:', songs);
        })
      );
  }

  deleteSong(songId: number): Observable<Song[]> {
    const url = `http://${window.location.hostname}:4000/delete`;
    return this.http
      .delete<Song[]>(url, { body: { id: songId } })
      .pipe(tap((songs) => console.log('Deleted song:', songs)));
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
        tap((response) => {
          if (response && response.songs) {
            console.log('Uploaded files:', response.songs);
          }
        })
      );
  }
}

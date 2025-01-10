import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  file_path: string;
  album_cover_url: string;
  upload_date: string;
}

interface UploadResponse {
  songs: Song[];
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private filePathSubject = new BehaviorSubject<string | null>(null);
  filePath$ = this.filePathSubject.asObservable();

  private songsSubject = new BehaviorSubject<Song[]>([]);
  songs$ = this.songsSubject.asObservable();

  constructor(private http: HttpClient) {}

  setFilePath(filePath: string) {
    this.filePathSubject.next(filePath);
  }

  fetchSongs(): Observable<Song[]> {
    return this.http
      .get<Song[]>(`http://${window.location.hostname}:4000/songs`)
      .pipe(tap((songs) => this.songsSubject.next(songs)));
  }

  deleteSong(songId: number): Observable<Song[]> {
    const url = `http://${window.location.hostname}:4000/delete`;
    return this.http
      .delete<Song[]>(url, { body: { id: songId } })
      .pipe(tap((songs) => this.songsSubject.next(songs)));
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
            this.songsSubject.next(response.songs);
          }
        })
      );
  }
}

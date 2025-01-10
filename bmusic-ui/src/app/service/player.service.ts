import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private filePathSubject = new BehaviorSubject<string | null>(null);
  filePath$ = this.filePathSubject.asObservable();

  private songsSubject = new BehaviorSubject<any[]>([]);
  songs$ = this.songsSubject.asObservable();

  constructor(private http: HttpClient) {}

  setFilePath(filePath: string) {
    this.filePathSubject.next(filePath);
  }

  fetchSongs(): Observable<any[]> {
    return this.http
      .get<any[]>(`http://${window.location.hostname}:4000/songs`)
      .pipe(tap((songs) => this.songsSubject.next(songs)));
  }

  deleteSong(songId: number): Observable<any> {
    const url = `http://${window.location.hostname}:4000/delete`;
    return this.http
      .delete<any[]>(url, { body: { id: songId } })
      .pipe(tap((songs) => this.songsSubject.next(songs)));
  }

  uploadFiles(files: File[]): Observable<any[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.http
      .post<any[]>(`http://${window.location.hostname}:4000/upload`, formData)
      .pipe(tap((songs) => this.songsSubject.next(songs)));
  }
}

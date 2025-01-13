import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Song, UploadResponse } from './models/song-def.class';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private currentSongIndex = 0;
  private filePathSubject = new BehaviorSubject<string | null>(null);
  filePath$ = this.filePathSubject.asObservable();

  private songsSubject = new BehaviorSubject<Song[]>([]);
  songs$ = this.songsSubject.asObservable();

  private titleSubject = new BehaviorSubject<string | null>(null);
  title$ = this.titleSubject.asObservable();

  constructor(private apiService: ApiService) {}

  setFilePath(filePath: string) {
    this.filePathSubject.next(filePath);
  }
  setTitle(title: string) {
    console.log(title);
    this.titleSubject.next(title);
  }

  fetchSongs(): Observable<Song[]> {
    return this.apiService
      .fetchSongs()
      .pipe(tap((songs) => this.songsSubject.next(songs)));
  }

  deleteSong(songId: number): Observable<Song[]> {
    return this.apiService
      .deleteSong(songId)
      .pipe(tap((songs) => this.songsSubject.next(songs)));
  }

  uploadFiles(files: File[]): Observable<UploadResponse> {
    return this.apiService.uploadFiles(files).pipe(
      tap((response) => {
        if (response && response.songs) {
          this.songsSubject.next(response.songs);
        }
      })
    );
  }
  changeSong(offset: number) {
    const songs = this.songsSubject.getValue();
    const currentFilePath = this.filePathSubject.getValue();
    const currentSongIndex = songs.findIndex(
      (song) => song.file_path === currentFilePath
    );

    if (currentSongIndex !== -1) {
      this.currentSongIndex =
        (currentSongIndex + offset + songs.length) % songs.length;
      const newSong = songs[this.currentSongIndex];
      this.setFilePath(newSong.file_path);
      this.setTitle(newSong.title);
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Song, UploadResponse } from './models/song-def.class';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  currentSongIndex = 0;

  private filePathSubject = new BehaviorSubject<string | null>(null);
  filePath$ = this.filePathSubject.asObservable();

  private songsSubject = new BehaviorSubject<Song[]>([]);
  songs$ = this.songsSubject.asObservable();

  private titleSubject = new BehaviorSubject<string | null>(null);
  title$ = this.titleSubject.asObservable();
  private coverPath = new BehaviorSubject<string | null>(null);
  coverPath$ = this.coverPath.asObservable();
  private songId = new BehaviorSubject<number | null>(null);
  songId$ = this.songId.asObservable();

  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  currentSong$ = this.currentSongSubject.asObservable();
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  constructor(private apiService: ApiService) {}

  setFilePath(filePath: string) {
    this.filePathSubject.next(filePath);
  }

  setTitle(title: string) {
    console.log(title);
    this.titleSubject.next(title);
  }
  setIsPlaying(isPlaying: boolean) {
    this.isPlayingSubject.next(isPlaying);
  }
  setCover(album_cover_url: string) {
    this.coverPath.next(album_cover_url);
    console.log(this.coverPath.getValue());
  }
  setId(songId: number) {
    this.songId.next(songId);
    console.log(this.songId.getValue());
  }
  setCurrentSong(song: Song) {
    this.currentSongSubject.next(song);
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
      this.setCurrentSong(newSong);
    }
  }
}

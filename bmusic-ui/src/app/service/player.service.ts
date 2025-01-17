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

  private isShuffleSubject = new BehaviorSubject<boolean>(false);
  isShuffle$ = this.isShuffleSubject.asObservable();

  private isRepeatSubject = new BehaviorSubject<boolean>(false);
  isRepeat$ = this.isRepeatSubject.asObservable();

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

  setData(
    songId: number,
    filePath: string,
    title: string,
    album_cover_url: string
  ) {
    this.setId(songId);
    this.setTitle(title);
    this.setFilePath(filePath);
    this.setCover(album_cover_url);
    this.setIsPlaying(true);
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

  setShuffle(isShuffle: boolean) {
    this.isShuffleSubject.next(isShuffle);
    console.log('Shuffle state set to:', isShuffle);
  }

  setRepeat(isRepeat: boolean) {
    this.isRepeatSubject.next(isRepeat);
    console.log('Repeat state set to:', isRepeat);
  }
  playRandomSong() {
    const songs = this.songsSubject.getValue();
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    this.setData(
      randomSong.id,
      randomSong.file_path,
      randomSong.title,
      randomSong.album_cover_url
    );
  }
}

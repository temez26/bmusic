import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UploadResponse } from './models/song-def.class';
import { tap } from 'rxjs/operators';
import { PlayerStateService } from './player.state.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(
    private apiService: ApiService,
    private stateService: PlayerStateService
  ) {}

  fetchSongs(): Observable<any> {
    return this.apiService
      .fetchSongs()
      .pipe(tap((songs) => this.stateService['songsSubject'].next(songs)));
  }

  deleteSong(songId: number): Observable<any> {
    return this.apiService
      .deleteSong(songId)
      .pipe(tap((songs) => this.stateService['songsSubject'].next(songs)));
  }

  uploadFiles(files: File[]): Observable<UploadResponse> {
    return this.apiService.uploadFiles(files).pipe(
      tap((response) => {
        if (response && response.songs) {
          this.stateService['songsSubject'].next(response.songs);
        }
      })
    );
  }
  setData(
    songId: number,
    filePath: string,
    title: string,
    album_cover_url: string,
    artist: string
  ) {
    this.stateService.setId(songId);
    this.stateService.setTitle(title);
    this.stateService.setFilePath(filePath);
    this.stateService.setCover(album_cover_url);
    this.stateService.setArtist(artist);
    this.stateService.setIsPlaying(true);
  }
  changeSong(offset: number) {
    const songs = this.stateService.songsSubject.getValue();
    const currentFilePath = this.stateService.filePathSubject.getValue();
    const currentSongIndex = songs.findIndex(
      (song) => song.file_path === currentFilePath
    );

    if (currentSongIndex !== -1) {
      const newIndex =
        (currentSongIndex + offset + songs.length) % songs.length;
      const newSong = songs[newIndex];
      this.stateService.setFilePath(newSong.file_path);
      this.stateService.setTitle(newSong.title);
      this.stateService.setCurrentSong(newSong);
    }
  }
  playRandomSong() {
    const songs = this.stateService.songsSubject.getValue();
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    this.setData(
      randomSong.id,
      randomSong.file_path,
      randomSong.title,
      randomSong.album_cover_url,
      randomSong.artist
    );
  }
}

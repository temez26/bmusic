import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from './models/song-def.class';

@Injectable({
  providedIn: 'root',
})
export class PlayerStateService {
  filePathSubject = new BehaviorSubject<string | null>(null);
  filePath$ = this.filePathSubject.asObservable();

  songsSubject = new BehaviorSubject<Song[]>([]);
  songs$ = this.songsSubject.asObservable();

  private titleSubject = new BehaviorSubject<string | null>(null);
  title$ = this.titleSubject.asObservable();

  private artistPath = new BehaviorSubject<string | null>(null);
  artistPath$ = this.artistPath.asObservable();

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

  setFilePath(filePath: string) {
    this.filePathSubject.next(filePath);
  }

  setTitle(title: string) {
    this.titleSubject.next(title);
  }

  setIsPlaying(isPlaying: boolean) {
    this.isPlayingSubject.next(isPlaying);
  }

  setCover(album_cover_url: string) {
    this.coverPath.next(album_cover_url);
  }

  setArtist(artist: string) {
    this.artistPath.next(artist);
  }

  setId(songId: number) {
    this.songId.next(songId);
  }

  setCurrentSong(song: Song) {
    this.currentSongSubject.next(song);
  }

  setShuffle(isShuffle: boolean) {
    this.isShuffleSubject.next(isShuffle);
  }

  setRepeat(isRepeat: boolean) {
    this.isRepeatSubject.next(isRepeat);
  }
}

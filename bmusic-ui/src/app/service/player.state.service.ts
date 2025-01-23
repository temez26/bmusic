import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from './models/song.model';

@Injectable({
  providedIn: 'root',
})
// Handles Song data that is fetched from the server
export class PlayerStateService {
  private songsSubject = new BehaviorSubject<Song[]>([]);
  public songs$: Observable<Song[]> = this.songsSubject.asObservable();

  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  public currentSong$: Observable<Song | null> =
    this.currentSongSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();

  private isShuffleSubject = new BehaviorSubject<boolean>(false);
  public isShuffle$: Observable<boolean> = this.isShuffleSubject.asObservable();

  private isRepeatSubject = new BehaviorSubject<boolean>(false);
  public isRepeat$: Observable<boolean> = this.isRepeatSubject.asObservable();

  private filePathSubject = new BehaviorSubject<string | null>(null);
  public filePath$: Observable<string | null> =
    this.filePathSubject.asObservable();

  private titleSubject = new BehaviorSubject<string | null>(null);
  public title$: Observable<string | null> = this.titleSubject.asObservable();

  private artistPathSubject = new BehaviorSubject<string | null>(null);
  public artistPath$: Observable<string | null> =
    this.artistPathSubject.asObservable();

  private coverPathSubject = new BehaviorSubject<string | null>(null);
  public coverPath$: Observable<string | null> =
    this.coverPathSubject.asObservable();

  private songIdSubject = new BehaviorSubject<number | null>(null);
  public songId$: Observable<number | null> = this.songIdSubject.asObservable();

  setSongs(songs: Song[]): void {
    this.songsSubject.next([...songs]);
  }

  getSongs(): Song[] {
    return this.songsSubject.getValue();
  }

  setCurrentSong(song: Song): void {
    this.currentSongSubject.next({ ...song });
  }

  getCurrentSong(): Song | null {
    return this.currentSongSubject.getValue();
  }

  setIsPlaying(isPlaying: boolean): void {
    this.isPlayingSubject.next(isPlaying);
  }

  getIsPlaying(): boolean {
    return this.isPlayingSubject.getValue();
  }

  setShuffle(isShuffle: boolean): void {
    this.isShuffleSubject.next(isShuffle);
  }

  getShuffle(): boolean {
    return this.isShuffleSubject.getValue();
  }

  setRepeat(isRepeat: boolean): void {
    this.isRepeatSubject.next(isRepeat);
  }

  getRepeat(): boolean {
    return this.isRepeatSubject.getValue();
  }

  setFilePath(filePath: string): void {
    this.filePathSubject.next(filePath);
  }

  getFilePath(): string | null {
    return this.filePathSubject.getValue();
  }

  setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  getTitle(): string | null {
    return this.titleSubject.getValue();
  }

  setArtist(artist: string): void {
    this.artistPathSubject.next(artist);
  }

  getArtist(): string | null {
    return this.artistPathSubject.getValue();
  }

  setCover(coverPath: string): void {
    this.coverPathSubject.next(coverPath);
  }

  getCover(): string | null {
    return this.coverPathSubject.getValue();
  }

  setId(songId: number): void {
    this.songIdSubject.next(songId);
  }

  getId(): number | null {
    return this.songIdSubject.getValue();
  }

  private updateSongDetails(song: Song): void {
    this.setCurrentSong(song);
    this.setTitle(song.title);
    this.setFilePath(song.file_path);
    this.setCover(song.album_cover_url);
    this.setArtist(song.artist);
    this.setId(song.id);
    this.setIsPlaying(true);
  }

  setCurrentSongById(songId: number): void {
    const song = this.getSongs().find((s) => s.id === songId);
    if (song) {
      this.updateSongDetails(song);
    } else {
      console.error('Song not found with id:', songId);
    }
  }
}

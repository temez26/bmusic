import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerModel } from '../models/player.class';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
// service for handling states in PlayerModel
export class PlayerService {
  player: PlayerModel = new PlayerModel();

  private isPlayingSubject = new BehaviorSubject<boolean>(
    this.player.isPlaying
  );
  public isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();

  private isShuffleSubject = new BehaviorSubject<boolean>(
    this.player.isShuffle
  );
  public isShuffle$: Observable<boolean> = this.isShuffleSubject.asObservable();

  private isRepeatSubject = new BehaviorSubject<boolean>(this.player.isRepeat);
  public isRepeat$: Observable<boolean> = this.isRepeatSubject.asObservable();

  private filePathSubject = new BehaviorSubject<string | null>(null);
  public filePath$: Observable<string | null> =
    this.filePathSubject.asObservable();

  private titleSubject = new BehaviorSubject<string | null>(
    this.player.currentTitle
  );
  public title$: Observable<string | null> = this.titleSubject.asObservable();

  private artistPathSubject = new BehaviorSubject<string | null>(
    this.player.currentArtist
  );
  public artistPath$: Observable<string | null> =
    this.artistPathSubject.asObservable();

  private coverPathSubject = new BehaviorSubject<string | null>(
    this.player.currentAlbumCover
  );
  public coverPath$: Observable<string | null> =
    this.coverPathSubject.asObservable();

  private songIdSubject = new BehaviorSubject<number | null>(
    this.player.currentSongId
  );
  public songId$: Observable<number | null> = this.songIdSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject<string | null>(
    this.player.formattedCurrentTime
  );
  public currentTime$: Observable<string | null> =
    this.currentTimeSubject.asObservable();

  private audioCurrentTimeSubject = new BehaviorSubject<number | null>(
    this.player.currentTime
  );

  public audioCurrentTime$: Observable<number | null> =
    this.audioCurrentTimeSubject.asObservable();

  constructor() {}

  updateIsPlaying(isPlaying: boolean): void {
    this.player.isPlaying = isPlaying;
    this.isPlayingSubject.next(isPlaying);
  }

  updateIsShuffle(isShuffle: boolean): void {
    this.player.isShuffle = isShuffle;
    this.isShuffleSubject.next(isShuffle);
  }

  updateIsRepeat(isRepeat: boolean): void {
    this.player.isRepeat = isRepeat;
    this.isRepeatSubject.next(isRepeat);
  }

  updateFilePath(filePath: string | null): void {
    this.filePathSubject.next(filePath);
  }

  updateTitle(title: string | null): void {
    this.player.currentTitle = title;
    this.titleSubject.next(title);
  }

  updateArtistPath(artistPath: string | null): void {
    this.player.currentArtist = artistPath;
    this.artistPathSubject.next(artistPath);
  }

  updateCoverPath(coverPath: string): void {
    this.player.currentAlbumCover = environment.apiBaseUrl + coverPath;
    this.coverPathSubject.next(coverPath);
  }

  updateSongId(songId: number | null): void {
    this.player.currentSongId = songId;
    this.songIdSubject.next(songId);
  }
  updateFormattedCurrentTime(formattedCurrentTime: string): void {
    this.player.formattedCurrentTime = formattedCurrentTime;
    this.currentTimeSubject.next(formattedCurrentTime);
  }
  updateCurrentTime(currentTime: number): void {
    this.player.currentTime = currentTime;
    this.audioCurrentTimeSubject.next(currentTime);
  }
}

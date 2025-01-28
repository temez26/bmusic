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

  private formattedCurrentTimeSubject = new BehaviorSubject<string | null>(
    this.player.formattedCurrentTime
  );
  public formattedCurrentTime$: Observable<string | null> =
    this.formattedCurrentTimeSubject.asObservable();

  private formattedLengthSubject = new BehaviorSubject<string | null>(
    this.player.formattedLength
  );
  public formattedLength$: Observable<string | null> =
    this.formattedLengthSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject<number | null>(
    this.player.currentTime
  );

  public currentTime$: Observable<number | null> =
    this.currentTimeSubject.asObservable();

  private audioDurationSubject = new BehaviorSubject<number | null>(
    this.player.audioDuration
  );
  public audioDuration$: Observable<number | null> =
    this.audioDurationSubject.asObservable();

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
    this.formattedCurrentTimeSubject.next(formattedCurrentTime);
  }
  updateFormattedLength(formattedLength: string): void {
    this.player.formattedLength = formattedLength;
    this.formattedLengthSubject.next(formattedLength);
  }
  updateCurrentTime(currentTime: number): void {
    this.player.currentTime = currentTime;
    this.currentTimeSubject.next(currentTime);
  }
  updateAudioDuration(audioDuration: number) {
    this.player.audioDuration = audioDuration;
    this.audioDurationSubject.next(audioDuration);
  }
}

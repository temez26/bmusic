import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerModel } from '../models/player.class';
import { PlayerStorageService } from '../storage/player-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
// service for handling states in PlayerModel
export class PlayerService {
  player: PlayerModel;

  private isPlayingSubject: BehaviorSubject<boolean>;
  public isPlaying$: Observable<boolean>;

  private isShuffleSubject: BehaviorSubject<boolean>;
  public isShuffle$: Observable<boolean>;

  private isRepeatSubject: BehaviorSubject<boolean>;
  public isRepeat$: Observable<boolean>;

  private filePathSubject: BehaviorSubject<string | null>;
  public filePath$: Observable<string | null>;

  private titleSubject: BehaviorSubject<string | null>;
  public title$: Observable<string | null>;

  private artistPathSubject: BehaviorSubject<string | null>;
  public artistPath$: Observable<string | null>;

  private coverPathSubject: BehaviorSubject<string | null>;
  public coverPath$: Observable<string | null>;

  private songIdSubject: BehaviorSubject<number | null>;
  public songId$: Observable<number | null>;

  private formattedCurrentTimeSubject: BehaviorSubject<string | null>;
  public formattedCurrentTime$: Observable<string | null>;

  private formattedLengthSubject: BehaviorSubject<string | null>;
  public formattedLength$: Observable<string | null>;

  private currentTimeSubject: BehaviorSubject<number | null>;
  public currentTime$: Observable<number | null>;

  private audioDurationSubject: BehaviorSubject<number | null>;
  public audioDuration$: Observable<number | null>;

  constructor(private playerStorageService: PlayerStorageService) {
    this.player = this.playerStorageService.loadPlayerState();

    this.isPlayingSubject = new BehaviorSubject<boolean>(this.player.isPlaying);
    this.isPlaying$ = this.isPlayingSubject.asObservable();

    this.isShuffleSubject = new BehaviorSubject<boolean>(this.player.isShuffle);
    this.isShuffle$ = this.isShuffleSubject.asObservable();

    this.isRepeatSubject = new BehaviorSubject<boolean>(this.player.isRepeat);
    this.isRepeat$ = this.isRepeatSubject.asObservable();

    this.filePathSubject = new BehaviorSubject<string | null>(
      this.player.filePath
    );
    this.filePath$ = this.filePathSubject.asObservable();

    this.titleSubject = new BehaviorSubject<string | null>(
      this.player.currentTitle
    );
    this.title$ = this.titleSubject.asObservable();

    this.artistPathSubject = new BehaviorSubject<string | null>(
      this.player.currentArtist
    );
    this.artistPath$ = this.artistPathSubject.asObservable();

    this.coverPathSubject = new BehaviorSubject<string | null>(
      this.player.currentAlbumCover
    );
    this.coverPath$ = this.coverPathSubject.asObservable();

    this.songIdSubject = new BehaviorSubject<number | null>(
      this.player.currentSongId
    );
    this.songId$ = this.songIdSubject.asObservable();

    this.formattedCurrentTimeSubject = new BehaviorSubject<string | null>(
      this.player.formattedCurrentTime
    );
    this.formattedCurrentTime$ =
      this.formattedCurrentTimeSubject.asObservable();

    this.formattedLengthSubject = new BehaviorSubject<string | null>(
      this.player.formattedLength
    );
    this.formattedLength$ = this.formattedLengthSubject.asObservable();

    this.currentTimeSubject = new BehaviorSubject<number | null>(
      this.player.currentTime
    );
    this.currentTime$ = this.currentTimeSubject.asObservable();

    this.audioDurationSubject = new BehaviorSubject<number | null>(
      this.player.audioDuration
    );
    this.audioDuration$ = this.audioDurationSubject.asObservable();
  }

  updateIsPlaying(isPlaying: boolean): void {
    this.player.isPlaying = isPlaying;
    this.isPlayingSubject.next(isPlaying);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateIsShuffle(isShuffle: boolean): void {
    this.player.isShuffle = isShuffle;
    this.isShuffleSubject.next(isShuffle);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateIsRepeat(isRepeat: boolean): void {
    this.player.isRepeat = isRepeat;
    this.isRepeatSubject.next(isRepeat);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateFilePath(filePath: string | ''): void {
    this.player.filePath = filePath;
    this.player.currentTime = 0;
    this.filePathSubject.next(filePath);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateTitle(title: string | null): void {
    this.player.currentTitle = title;
    this.titleSubject.next(title);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateArtistPath(artistPath: string | null): void {
    this.player.currentArtist = artistPath;
    this.artistPathSubject.next(artistPath);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateCoverPath(coverPath: string): void {
    this.player.currentAlbumCover = environment.apiBaseUrl + coverPath;
    this.coverPathSubject.next(coverPath);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateSongId(songId: number | null): void {
    this.player.currentSongId = songId;
    this.songIdSubject.next(songId);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateFormattedCurrentTime(formattedCurrentTime: string): void {
    this.player.formattedCurrentTime = formattedCurrentTime;
    this.formattedCurrentTimeSubject.next(formattedCurrentTime);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateFormattedLength(formattedLength: string): void {
    this.player.formattedLength = formattedLength;
    this.formattedLengthSubject.next(formattedLength);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateCurrentTime(currentTime: number): void {
    this.player.currentTime = currentTime;
    this.currentTimeSubject.next(currentTime);
    this.playerStorageService.savePlayerState(this.player);
  }

  updateAudioDuration(audioDuration: number): void {
    this.player.audioDuration = audioDuration;
    this.audioDurationSubject.next(audioDuration);
    this.playerStorageService.savePlayerState(this.player);
  }
}

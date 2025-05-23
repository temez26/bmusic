import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PlayerModel,
  PlayerStorageService,
  PlayerStateService,
} from '../../service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  public player: PlayerModel;
  constructor(
    private playerStateService: PlayerStateService,
    private playerStorageService: PlayerStorageService
  ) {
    this.player = this.playerStateService.player;
  }

  updateState(key: string, value: any): void {
    this.playerStateService.setState(key, value);
    this.playerStorageService.savePlayerState(this.playerStateService.player);
  }

  updateIsPlaying(isPlaying: boolean): void {
    this.updateState('isPlaying', !!isPlaying);
  }

  updateIsShuffle(isShuffle: boolean): void {
    this.updateState('isShuffle', !!isShuffle);
  }

  updateIsRepeat(isRepeat: boolean): void {
    this.updateState('isRepeat', !!isRepeat);
  }

  updateFilePath(filePath: string | ''): void {
    this.updateState('filePath', filePath);
  }

  updateTitle(title: string | null): void {
    this.updateState('title', title);
  }

  updateArtistPath(artistPath: string | null): void {
    this.updateState('artistPath', artistPath);
  }

  updateCoverPath(coverPath: string): void {
    this.updateState('coverPath', coverPath);
  }

  updateSongId(songId: number | null): void {
    this.updateState('songId', songId);
  }

  updateFormattedCurrentTime(formattedCurrentTime: string): void {
    this.updateState('formattedCurrentTime', formattedCurrentTime);
  }

  updateFormattedLength(formattedLength: string): void {
    this.updateState('formattedLength', formattedLength);
  }

  updateCurrentTime(currentTime: number): void {
    this.updateState('currentTime', currentTime);
  }

  updateAudioDuration(audioDuration: number): void {
    this.updateState('audioDuration', audioDuration);
  }

  // subscribe functions

  subscribeToFilePath(): Observable<string | null> {
    return this.playerStateService.filePath$;
  }
  subscribeToIsplaying(): Observable<boolean> {
    return this.playerStateService.isPlaying$;
  }
}

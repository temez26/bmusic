import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerModel } from '../models/player.class';
import { PlayerStorageService } from '../storage/player-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerStateService {
  player: PlayerModel;

  private stateSubjects: { [key: string]: BehaviorSubject<any> } = {};
  public states$: { [key: string]: Observable<any> } = {};

  constructor(private playerStorageService: PlayerStorageService) {
    this.player = this.playerStorageService.loadPlayerState();
    this.initializeState('isPlaying', this.player.isPlaying);
    this.initializeState('isShuffle', this.player.isShuffle);
    this.initializeState('isRepeat', this.player.isRepeat);
    this.initializeState('filePath', this.player.filePath);
    this.initializeState('title', this.player.currentTitle);
    this.initializeState('artistPath', this.player.currentArtist);
    this.initializeState('coverPath', this.player.currentAlbumCover);
    this.initializeState('songId', this.player.currentSongId);
    this.initializeState(
      'formattedCurrentTime',
      this.player.formattedCurrentTime
    );
    this.initializeState('formattedLength', this.player.formattedLength);
    this.initializeState('currentTime', this.player.currentTime);
    this.initializeState('audioDuration', this.player.audioDuration);
  }

  private initializeState<T>(key: string, initialValue: T): void {
    this.stateSubjects[key] = new BehaviorSubject<T>(initialValue);
    this.states$[key] = this.stateSubjects[key].asObservable();
  }

  // Setter methods
  setState<T>(key: string, value: T): void {
    // Special handling for coverPath
    if (key === 'coverPath') {
      value = (environment.apiBaseUrl + value) as any;
    }
    (this.player as any)[this.getPlayerProperty(key)] = value;
    this.stateSubjects[key].next(value);
  }

  private getPlayerProperty(key: string): string {
    const mapping: { [key: string]: string } = {
      isPlaying: 'isPlaying',
      isShuffle: 'isShuffle',
      isRepeat: 'isRepeat',
      filePath: 'filePath',
      title: 'currentTitle',
      artistPath: 'currentArtist',
      coverPath: 'currentAlbumCover',
      songId: 'currentSongId',
      formattedCurrentTime: 'formattedCurrentTime',
      formattedLength: 'formattedLength',
      currentTime: 'currentTime',
      audioDuration: 'audioDuration',
    };
    return mapping[key];
  }
  get filePath$(): Observable<string | null> {
    return this.states$['filePath'];
  }
  get isPlaying$(): Observable<boolean> {
    return this.states$['isPlaying'];
  }
}

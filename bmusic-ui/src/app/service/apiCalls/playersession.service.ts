import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../service';
import { PlayerModel } from '../models/player.class';

export interface RemoteState extends PlayerModel {
  deviceId: string;
  action?:
    | 'play'
    | 'pause'
    | 'seek'
    | 'next'
    | 'prev'
    | 'shuffle'
    | 'repeat'
    | 'volume'
    | 'timeupdate';
}

@Injectable({ providedIn: 'root' })
export class PlayerSessionService {
  private socket!: Socket;
  public devices$ = new BehaviorSubject<string[]>([]);
  public mainDeviceId$ = new BehaviorSubject<string>('');
  public playerState$ = new BehaviorSubject<RemoteState | null>(null);

  public deviceId: string;

  constructor(private api: ApiService) {
    // generate or reuse your own id
    const storedId = localStorage.getItem('deviceId');
    this.deviceId =
      storedId || `${Math.random().toString(36).slice(2)}-${Date.now()}`;
    localStorage.setItem('deviceId', this.deviceId);

    // restore global main if any
    const storedMain = localStorage.getItem('mainDeviceId') || this.deviceId;
    this.mainDeviceId$.next(storedMain);

    this.socket = io(this.api.baseUrl, {
      transports: ['websocket'],
      query: { deviceId: this.deviceId },
    });

    this.socket.on('devices', (list) => this.devices$.next(list));

    // ←– listen for global main changes
    this.socket.on('mainDeviceChanged', (id: string) => {
      this.mainDeviceId$.next(id);
      localStorage.setItem('mainDeviceId', id);
    });

    this.socket.on('playerState', (state: RemoteState) => {
      this.playerState$.next(state);
    });
  }

  setMainDevice(id: string) {
    this.mainDeviceId$.next(id);
    localStorage.setItem('mainDeviceId', id);
    // Broadcast to all clients
    this.socket.emit('setMainDevice', id);
  }

  // IMPORTANT: Allow commands from ANY device
  updatePlayerState(state: PlayerModel, action?: RemoteState['action']) {
    // Send complete state object with all fields
    this.socket.emit('updatePlayerState', {
      ...state, // Include ALL fields from PlayerModel
      deviceId: this.deviceId,
      action,
      // Explicitly set critical fields to avoid timing issues
      isPlaying: state.isPlaying,
      currentTitle: state.currentTitle,
      currentArtist: state.currentArtist,
      currentAlbumCover: state.currentAlbumCover,
      volumePercentage: state.volumePercentage,
      isShuffle: state.isShuffle,
      isRepeat: state.isRepeat,
      filePath: state.filePath,
      formattedLength: state.formattedLength,
      formattedCurrentTime: state.formattedCurrentTime,
    });
  }
}

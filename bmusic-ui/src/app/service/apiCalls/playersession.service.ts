import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { ApiService, Song } from '../../service';
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
    | 'timeupdate'
    | 'sync_request';
  osName?: string;
}

@Injectable({ providedIn: 'root' })
export class PlayerSessionService {
  private socket!: Socket;
  public devices$ = new BehaviorSubject<string[]>([]);
  public mainDeviceId$ = new BehaviorSubject<string>('');
  public playerState$ = new BehaviorSubject<RemoteState | null>(null);
  public playlistState$ = new BehaviorSubject<Song[]>([]);

  public deviceId: string;
  private localDeviceName!: string;

  constructor(private api: ApiService) {
    // generate or reuse your own id
    const storedId = localStorage.getItem('deviceId');
    this.deviceId =
      storedId || `${Math.random().toString(36).slice(2)}-${Date.now()}`;
    localStorage.setItem('deviceId', this.deviceId);

    // restore global main if any
    const storedMain = localStorage.getItem('mainDeviceId') || this.deviceId;
    this.mainDeviceId$.next(storedMain);
    this.localDeviceName = this.getDeviceFingerprint();

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
    this.socket.on('playlistState', (songs: Song[]) => {
      this.playlistState$.next(songs);
    });
  }

  setMainDevice(id: string) {
    this.mainDeviceId$.next(id);
    localStorage.setItem('mainDeviceId', id);
    // Broadcast to all clients
    this.socket.emit('setMainDevice', id);
  }
  updatePlaylistState(songs: Song[]): void {
    this.socket.emit('updatePlaylistState', songs);
  }
  private getDeviceName(): string {
    const ua = navigator.userAgent;
    if (/Windows NT/.test(ua)) return 'Windows';
    if (/Android/.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
    if (/Macintosh/.test(ua)) return 'macOS';
    if (/Linux/.test(ua)) return 'Linux';
    return 'Unknown';
  }
  private getDeviceFingerprint(): string {
    const ua = navigator.userAgent;
    const os = this.getDeviceName();

    // only browser name, no version
    let browser = 'Unknown';
    if (/Chrome\/\d+/.test(ua) && !/Edg\/\d+/.test(ua)) browser = 'Chrome';
    else if (/Firefox\/\d+/.test(ua)) browser = 'Firefox';
    else if (/Safari\/\d+/.test(ua) && /Version\/\d+/.test(ua))
      browser = 'Safari';
    else if (/Edg\/\d+/.test(ua)) browser = 'Edge';

    return `${os} · ${browser}`;
  }
  // IMPORTANT: Allow commands from ANY device
  updatePlayerState(state: PlayerModel, action?: RemoteState['action']) {
    // Send complete state object with all fields
    this.socket.emit('updatePlayerState', {
      ...state, // Include ALL fields from PlayerModel
      deviceId: this.deviceId,
      osName: this.localDeviceName,
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

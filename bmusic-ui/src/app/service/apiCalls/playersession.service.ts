import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
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
export class PlayerSessionService implements OnDestroy {
  private socket!: Socket;
  private reconnectTimer: any;
  private readonly RECONNECT_INTERVAL = 5000; // 5 seconds
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private reconnectAttempts = 0;

  public devices$ = new BehaviorSubject<string[]>([]);
  public mainDeviceId$ = new BehaviorSubject<string>('');
  public playerState$ = new BehaviorSubject<RemoteState | null>(null);
  public playlistState$ = new BehaviorSubject<Song[]>([]);
  public isConnected$ = new BehaviorSubject<boolean>(false);

  public deviceId!: string;
  private localDeviceName!: string;

  constructor(private api: ApiService) {
    this.initializeDeviceId();
    this.localDeviceName = this.getDeviceFingerprint();
    this.initializeSocket();
  }

  ngOnDestroy(): void {
    this.cleanupConnection();
  }

  /**
   * Clean up connection and timers on destroy
   */
  private cleanupConnection(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /**
   * Initialize device ID from localStorage or create new one
   */
  private initializeDeviceId(): void {
    const storedId = localStorage.getItem('deviceId');
    const storedMain = localStorage.getItem('mainDeviceId') || '';
    this.deviceId = storedId || uuidv4();
    localStorage.setItem('deviceId', this.deviceId);
    this.mainDeviceId$.next(storedMain);
  }

  /**
   * Initialize socket connection
   */
  private initializeSocket(): void {
    // Clean up any existing connection
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(this.api.baseUrl, {
      transports: ['websocket'],
      query: { deviceId: this.deviceId },
      reconnectionAttempts: this.MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: this.RECONNECT_INTERVAL,
    });

    this.setupSocketListeners();
  }

  /**
   * Set up all socket event listeners
   */
  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      this.isConnected$.next(true);
      this.reconnectAttempts = 0;

      // Request sync on reconnect
      if (this.mainDeviceId$.value) {
        this.socket.emit('updatePlayerState', {
          deviceId: this.deviceId,
          osName: this.localDeviceName,
          action: 'sync_request',
        });
      }
    });

    this.socket.on('disconnect', () => {
      this.isConnected$.next(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected$.next(false);
      this.handleReconnect();
    });

    this.socket.on('devices', (list: string[]) => {
      if (Array.isArray(list)) {
        this.devices$.next(list);
      }
    });

    this.socket.on('mainDeviceChanged', (id: string) => {
      if (typeof id === 'string') {
        this.mainDeviceId$.next(id);
        localStorage.setItem('mainDeviceId', id);
      }
    });

    this.socket.on('playerState', (state: RemoteState) => {
      if (this.isValidRemoteState(state)) {
        this.playerState$.next(state);
      }
    });

    this.socket.on('playlistState', (songs: Song[]) => {
      if (Array.isArray(songs)) {
        this.playlistState$.next(songs);
      }
    });
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})...`
      );

      this.reconnectTimer = setTimeout(() => {
        this.initializeSocket();
      }, this.RECONNECT_INTERVAL);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Validate remote state object
   */
  private isValidRemoteState(state: any): state is RemoteState {
    return (
      state && typeof state === 'object' && typeof state.deviceId === 'string'
    );
  }

  /**
   * Set the main device for playback control
   */
  setMainDevice(id: string): void {
    if (!id || typeof id !== 'string') {
      console.error('Invalid device ID');
      return;
    }

    this.mainDeviceId$.next(id);
    localStorage.setItem('mainDeviceId', id);
    this.socket.emit('setMainDevice', id);
  }

  /**
   * Update the current playlist state
   */
  updatePlaylistState(songs: Song[]): void {
    if (!Array.isArray(songs)) {
      console.error('Invalid playlist data');
      return;
    }

    this.socket.emit('updatePlaylistState', songs);
  }

  /**
   * Get device and browser information
   */
  private getDeviceFingerprint(): string {
    const ua = navigator.userAgent;

    // OS detection
    let os = 'Unknown';
    if (/Windows NT/.test(ua)) os = 'Windows';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if (/Macintosh/.test(ua)) os = 'macOS';
    else if (/Linux/.test(ua)) os = 'Linux';

    // Browser detection
    let browser = 'Unknown';
    if (/Chrome\/\d+/.test(ua) && !/Edg\/\d+/.test(ua)) browser = 'Chrome';
    else if (/Firefox\/\d+/.test(ua)) browser = 'Firefox';
    else if (/Safari\/\d+/.test(ua) && /Version\/\d+/.test(ua))
      browser = 'Safari';
    else if (/Edg\/\d+/.test(ua)) browser = 'Edge';

    return `${os} · ${browser}`;
  }

  /**
   * Update player state and broadcast to other devices
   * IMPORTANT: Allow commands from ANY device
   */
  updatePlayerState(state: PlayerModel, action?: RemoteState['action']): void {
    if (!state || typeof state !== 'object') {
      console.error('Invalid player state');
      return;
    }

    this.socket.emit('updatePlayerState', {
      ...state,
      deviceId: this.deviceId,
      osName: this.localDeviceName,
      action,
    });
  }

  /**
   * Force reconnect the socket
   */
  reconnect(): void {
    this.cleanupConnection();
    this.reconnectAttempts = 0;
    this.initializeSocket();
  }
}

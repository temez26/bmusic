import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerSessionService {
  private socket: Socket;
  public playerState$ = new BehaviorSubject<any>(null);

  constructor() {
    // Check for a previously stored device id
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      // generate a simple UID or use a library to create one
      deviceId =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('deviceId', deviceId);
    }
    console.log('Using device id:', deviceId);

    // Pass the deviceId as a query parameter
    this.socket = io(environment.apiBaseUrl, {
      transports: ['websocket'],
      query: { deviceId },
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server (socket id):', this.socket.id);
    });
    this.socket.on('playerState', (state: any) => {
      console.log('Received playerState:', state);
      this.playerState$.next(state);
    });
  }

  updatePlayerState(state: any): void {
    this.socket.emit('updatePlayerState', state);
  }
}

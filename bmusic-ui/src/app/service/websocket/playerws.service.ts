import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerWsService {
  constructor(private webSocketService: WebSocketService) {}

  startWebSocket(filePath: string): Promise<void> {
    return this.webSocketService
      .createWebSocket(filePath, 'audio')
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.getElementById('audio') as HTMLAudioElement;
        audio.src = url;
      })
      .catch((error) => {
        console.error('Error fetching audio:', error);
      });
  }
}

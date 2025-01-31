// filepath: /path/to/player-ws.service.ts

import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerWsService {
  initializeAudio(
    audioElement: HTMLAudioElement,
    filePath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(environment.apiBaseUrl + filePath);
      audioElement.src = environment.apiBaseUrl + filePath;
      audioElement.load();
      audioElement.oncanplaythrough = () => resolve();
      audioElement.onerror = (error) => reject(error);
    });
  }
}

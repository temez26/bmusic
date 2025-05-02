import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, take, catchError, tap, map } from 'rxjs';
import { ApiService, SongsStateService } from '../../service';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  constructor(private api: ApiService) {}

  initializeAudio(
    audioElement: HTMLAudioElement,
    filePath: string,
    songId: number | null,
    startTime: number = 0
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Extract just the filename from the filePath
      const filename = filePath.split('/').pop();

      // Construct URL with trackId in the path: /stream/{trackId}/{filename}
      audioElement.src = `${this.api.baseUrl}stream/${songId}/${filename}`;

      audioElement.load();
      audioElement.oncanplaythrough = () => {
        // Remove handler to avoid multiple calls when setting currentTime
        audioElement.oncanplaythrough = null;
        if (startTime > 0) {
          audioElement.currentTime = startTime;
        }
        resolve();
      };
      audioElement.onerror = (error) => reject(error);
    });
  }
}

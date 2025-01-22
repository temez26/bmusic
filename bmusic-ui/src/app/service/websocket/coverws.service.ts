import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class CoverWsService {
  coverImageSrcMap: { [key: number]: string } = {};
  private downloadedCovers: Map<string, Promise<string>> = new Map();

  constructor(private webSocketService: WebSocketService) {}

  getCovers(songId: number, coverPath: string): Promise<string> {
    if (this.downloadedCovers.has(coverPath)) {
      return this.downloadedCovers.get(coverPath)!;
    }

    const coverPromise = new Promise<string>((resolve, reject) => {
      if (!coverPath || coverPath === '/app/null') {
        const defaultCoverImageSrc = '/cd-cover.png';
        this.coverImageSrcMap[songId] = defaultCoverImageSrc;
        resolve(defaultCoverImageSrc);
        return;
      }

      this.webSocketService
        .createWebSocket(coverPath, 'image')
        .then((blob) => {
          const imageSrc = URL.createObjectURL(blob);
          this.coverImageSrcMap[songId] = imageSrc;
          resolve(imageSrc);
        })
        .catch((error) => {
          console.error('Error fetching cover:', error);
          reject(error);
        });
    });

    this.downloadedCovers.set(coverPath, coverPromise);
    return coverPromise;
  }
}

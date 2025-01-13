import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoverWsService {
  coverImageSrcMap: { [key: number]: string } = {};
  private downloadedCovers: Map<string, Promise<string>> = new Map();

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

      const ws = new WebSocket(`ws://${window.location.hostname}:4000`);
      ws.binaryType = 'arraybuffer';
      const chunks: ArrayBuffer[] = [];

      ws.onopen = () => {
        console.log('WebSocket for covers opened');
        ws.send(coverPath);
      };

      ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          if (event.data === 'EOF') {
            console.log('End of file received');
            const blob = new Blob(chunks, { type: 'image/jpeg' });
            const imageSrc = URL.createObjectURL(blob);
            this.coverImageSrcMap[songId] = imageSrc;
            resolve(imageSrc);
            ws.close();
          }
        } else if (event.data instanceof ArrayBuffer) {
          chunks.push(event.data);
        } else {
          console.error('Received unsupported data type:', event.data);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    });

    this.downloadedCovers.set(coverPath, coverPromise);
    return coverPromise;
  }
}

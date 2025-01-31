import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  createWebSocket(filePath: string, type: 'mp3' | 'flac'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(environment.wsUrl);
      const chunks: BlobPart[] = [];

      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        console.log('WebSocket connection opened');
        const message = JSON.stringify({ filePath, type });
        ws.send(message);
      };

      ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          if (event.data === 'EOF') {
            const mimeType = type === 'mp3' ? 'audio/mpeg' : 'audio/flac';
            const blob = new Blob(chunks, {
              type: mimeType,
            });
            resolve(blob);
            ws.close();
          } else if (
            event.data === 'Error reading file' ||
            event.data.startsWith('Invalid') ||
            event.data.startsWith('Unsupported')
          ) {
            console.error('Error reading file');
            ws.close();
            reject('Error reading file');
          }
        } else {
          chunks.push(event.data);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
    });
  }
}

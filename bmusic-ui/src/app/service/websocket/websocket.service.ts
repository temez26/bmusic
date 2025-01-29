import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  createWebSocket(filePath: string, type: 'audio'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(environment.wsUrl);
      const chunks: BlobPart[] = [];

      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        console.log('WebSocket connection opened');
        ws.send(filePath);
      };

      ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          if (event.data === 'EOF') {
            const blob = new Blob(chunks, {
              type: 'audio',
            });
            resolve(blob);
            ws.close();
          } else if (event.data === 'Error reading file') {
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

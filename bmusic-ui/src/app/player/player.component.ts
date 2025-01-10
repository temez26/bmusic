import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../service/player.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  title = 'bmusic-ui';

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.playerService.filePath$.subscribe((filePath) => {
      if (filePath) {
        this.startWebSocket(filePath);
      }
    });
  }

  startWebSocket(filePath: string) {
    const ws = new WebSocket(`ws://${window.location.hostname}:4000`);
    const chunks: BlobPart[] = [];

    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      ws.send(filePath);
    };

    ws.onmessage = (event) => {
      if (typeof event.data === 'string') {
        if (event.data === 'EOF') {
          console.log('End of file');
          const blob = new Blob(chunks, { type: 'audio/flac' });
          const url = URL.createObjectURL(blob);
          const audio = document.getElementById('audio') as HTMLAudioElement;
          audio.src = url;
          audio.play();
          ws.close();
        } else if (event.data === 'Error reading file') {
          console.error('Error reading file');
          ws.close();
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
    };
  }
}

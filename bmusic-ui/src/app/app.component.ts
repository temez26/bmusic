import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'bmusic-ui';

  ngOnInit() {
    const ws = new WebSocket('ws://localhost:4000');
    const chunks: BlobPart[] = [];

    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      // Send the file path of the FLAC file you want to stream
      ws.send('uploads/1736418570494.mp3');
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

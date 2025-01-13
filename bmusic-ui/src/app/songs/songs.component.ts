import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../service/player.service';
import { DeleteComponent } from '../delete/delete.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, DeleteComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent implements OnInit, OnDestroy {
  songs: any[] = [];
  coverImageSrcMap: { [key: number]: string } = {}; // Map to store cover images per song
  private downloadedCovers: Map<string, Promise<string>> = new Map(); // Map to store promises of downloaded covers

  private songsSubscription!: Subscription;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.songsSubscription = this.playerService.songs$.subscribe((songs) => {
      this.songs = songs;
      // Fetch covers for each song
      this.songs.forEach((song) =>
        this.getCovers(song.id, song.album_cover_url)
      );
    });
    this.playerService.fetchSongs().subscribe();
  }

  ngOnDestroy() {
    if (this.songsSubscription) {
      this.songsSubscription.unsubscribe();
    }
  }

  getCovers(songId: number, coverPath: string) {
    if (this.downloadedCovers.has(coverPath)) {
      // If already downloading or downloaded, use the existing promise
      this.downloadedCovers
        .get(coverPath)!
        .then((imageSrc) => {
          this.coverImageSrcMap[songId] = imageSrc;
        })
        .catch((error) => {
          console.error('Error fetching cover:', error);
        });
      return;
    }

    // Create a new promise for downloading the cover
    const coverPromise = new Promise<string>((resolve, reject) => {
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

    // Store the promise in the map
    this.downloadedCovers.set(coverPath, coverPromise);
  }

  playSong(filePath: string, title: string) {
    this.playerService.setFilePath(filePath);
    this.playerService.setTitle(title);
  }

  onSongDeleted() {
    this.playerService.fetchSongs().subscribe();
  }
}

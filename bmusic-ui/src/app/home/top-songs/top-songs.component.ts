import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverWsService } from '../../service/websocket/coverws.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../service/api.service';
import { AudioService } from '../../service/player/audio.service';
import { PlayerStateService } from '../../service/player.state.service';

@Component({
  selector: 'app-top-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-songs.component.html',
  styleUrl: './top-songs.component.scss',
})
export class TopSongsComponent implements OnInit {
  songs: any[] = [];

  constructor(
    private coverService: CoverWsService,
    private apiService: ApiService,
    private audioService: AudioService,
    private playerStateService: PlayerStateService
  ) {}

  ngOnInit() {
    this.playerStateService.songs$.subscribe((songs) => {
      this.songs = songs
        .sort((a, b) => b.play_count - a.play_count)
        .slice(0, 10);
      songs.forEach((song) => {
        this.coverService
          .getCovers(song.id, song.album_cover_url)
          .then((coverUrl) => {
            song.album_cover_url = coverUrl;
          })
          .catch((error) => {
            console.error('Error fetching cover:', error);
          });
      });
    });
  }

  playSong(
    songId: number,
    filePath: string,
    title: string,
    album_cover_url: string,
    artist: string
  ) {
    this.apiService.incrementPlayCount(songId).subscribe({
      next: () => {
        this.audioService.setData(
          songId,
          filePath,
          title,
          album_cover_url,
          artist
        );
      },
      error: (error) => {
        console.error('Error incrementing play count:', error);
      },
    });
  }
}

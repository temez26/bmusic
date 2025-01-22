import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../service/api.service';
import { AudioService } from '../../../service/player/audio.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  @Input() songId: number = 0;
  @Input() filePath: string = '';
  @Input() title: string = '';
  @Input() albumCoverUrl: string = '';
  @Input() artist: string = '';
  @Input() img: string = '';

  constructor(
    private apiService: ApiService,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {}

  playSong(
    songId: number,
    filePath: string,
    title: string,
    albumCoverUrl: string,
    artist: string
  ) {
    this.apiService.incrementPlayCount(this.songId).subscribe({
      next: () => {
        this.audioService.setData(
          songId,
          filePath,
          title,
          albumCoverUrl,
          artist
        );
      },
      error: (error) => {
        console.error('Error incrementing play count:', error);
      },
    });
  }
}

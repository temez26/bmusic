import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from '../shared/play/play.component';
import { PlayerStateService } from '../../service/states/player.state.service';

@Component({
  selector: 'app-top-songs',
  standalone: true,
  imports: [CommonModule, PlayComponent],
  templateUrl: './top-songs.component.html',
  styleUrl: './top-songs.component.scss',
})
export class TopSongsComponent implements OnInit {
  songs: any[] = [];

  constructor(private playerStateService: PlayerStateService) {}

  ngOnInit() {
    this.playerStateService.songs$.subscribe((songs) => {
      this.songs = songs
        .sort((a, b) => b.play_count - a.play_count)
        .slice(0, 10);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStateService } from '../../service/player.state.service';
import { PlayComponent } from '../shared/play/play.component';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, PlayComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent implements OnInit {
  songs: any[] = [];

  constructor(private playerStateService: PlayerStateService) {}

  ngOnInit() {
    this.playerStateService.songs$.subscribe((songs) => {
      this.songs = songs.sort((a, b) => a.id - b.id);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../service/player.service';
import { PlayerWsService } from '../service/playerws.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  currentTitle: string | null = null;

  constructor(
    private playerService: PlayerService,
    private playerWsService: PlayerWsService
  ) {}

  ngOnInit() {
    this.playerService.filePath$.subscribe((filePath) => {
      if (filePath) {
        this.playerWsService.startWebSocket(filePath);
      }
    });
    this.playerService.title$.subscribe((title) => {
      this.currentTitle = title;
    });
  }

  nextSong() {
    this.playerService.changeSong(1);
  }

  previousSong() {
    this.playerService.changeSong(-1);
  }
}

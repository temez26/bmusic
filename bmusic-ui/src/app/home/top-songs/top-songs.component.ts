import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from '../shared/play/play.component';
import { SongsStateService } from '../../service/states/songs.state.service';

@Component({
  selector: 'app-top-songs',
  standalone: true,
  imports: [CommonModule, PlayComponent],
  templateUrl: './top-songs.component.html',
  styleUrl: './top-songs.component.scss',
})
export class TopSongsComponent implements OnInit {
  songs: any[] = [];

  constructor(private songsState: SongsStateService) {}

  ngOnInit() {
    this.songsState.songs$.subscribe(() => {
      this.songs = this.songsState.sortSongs('play_count');
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from '../shared/songs-list/play/play.component';
import { SongsStateService } from '../../service/states/songs.state.service';
import { SortService } from '../../service/states/shared/sort.service';

@Component({
  selector: 'app-top-songs',
  standalone: true,
  imports: [CommonModule, PlayComponent],
  templateUrl: './top-songs.component.html',
  styleUrl: './top-songs.component.scss',
})
export class TopSongsComponent implements OnInit {
  songs: any[] = [];

  constructor(
    private helper: SortService,
    private songsState: SongsStateService
  ) {}

  ngOnInit() {
    this.songsState.songs$.subscribe(() => {
      this.songs = this.helper.sortSongs('play_count');
    });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';
import {
  environment,
  Song,
  SongsStateService,
  AudioService,
  PlayerSessionService,
} from '../../../../service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  @Input() songId = 0;
  @Input() title = '';
  @Input() img = '';
  @Input() customCover = '';
  @Input() customTitle = '';
  @Input() customColumn = '';
  @Input() albumSongs: Song[] = [];
  fullSongs: Song[] = [];

  constructor(
    private audioService: AudioService,
    private songsState: SongsStateService,

    private session: PlayerSessionService
  ) {}

  ngOnInit(): void {
    this.img = `${environment.apiBaseUrl}${this.img}`;
  }

  playSong(songId: number): void {
    // grab the current list once
    this.songsState.songs$.pipe(take(1)).subscribe((songs) => {
      this.fullSongs = songs;

      // choose album vs full playlist
      let playlist =
        this.albumSongs.length === this.fullSongs.length
          ? this.albumSongs
          : this.fullSongs;

      if (!playlist.find((s) => s.id === songId)) {
        playlist = this.fullSongs;
      }

      // set playlist and update AudioService

      this.audioService.setData(songId);

      // tell everyone to load & play on the main controller
      this.session.updatePlayerState(this.audioService.player, 'play');
    });
  }
}

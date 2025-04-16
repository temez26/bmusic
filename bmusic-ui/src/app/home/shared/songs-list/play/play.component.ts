import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../../service/player/audio.service';
import { SongsStateService } from '../../../../service/states/songs.state.service';
import { Song } from '../../../../service/models/song.interface';
import { environment } from '../../../../../environments/environment';
import { PlaylistStateService } from '../../../../service/states/playlist.state.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  @Input() songId: number = 0;
  @Input() title: string = '';
  @Input() img: string = '';
  @Input() customCover: string = '';
  @Input() customTitle: string = '';
  @Input() customColumn: string = '';
  // In album or artist pages this is provided.
  @Input() albumSongs: Song[] = [];

  constructor(
    private audioService: AudioService,
    private songsState: SongsStateService,
    private playlistService: PlaylistStateService
  ) {}

  ngOnInit(): void {
    this.img = `${environment.apiBaseUrl}${this.img}`;
  }

  playSong(songId: number): void {
    // Get the full songs list from the state.
    const fullSongs: Song[] = this.songsState.getSongs();

    // If albumSongs was passed and its length equals the full songs list,
    // then assume it represents a dedicated playlist (e.g. album or artist view),
    // otherwise fallback to the full list.
    let playlist: Song[] = fullSongs;
    if (
      this.albumSongs &&
      this.albumSongs.length > 0 &&
      this.albumSongs.length === fullSongs.length
    ) {
      playlist = this.albumSongs;
    }

    // Re-check: if the song isn't in the chosen playlist, fallback to the full list.
    if (!playlist.some((song) => song.id === songId)) {
      playlist = fullSongs;
    }

    // Set the current playlist and play the selected song.
    this.playlistService.setCurrentPlaylistSongs(playlist);
    this.audioService.setData(songId);
  }
}

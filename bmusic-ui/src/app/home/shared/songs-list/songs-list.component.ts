import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { PlayComponent } from './play/play.component';
import { MenuComponent } from './menu/menu.component';
import {
  PlaylistStateService,
  SortService,
  PlayerStateService,
  Playlist,
  Song,
  SongsStateService,
} from '../../../service';

@Component({
  selector: 'app-songs-list',
  standalone: true,
  imports: [CommonModule, PlayComponent, MenuComponent],
  templateUrl: './songs-list.component.html',
  styleUrls: ['./songs-list.component.scss'],
})
export class SongsListComponent implements OnInit, OnChanges {
  @Input() playlist?: Playlist;
  @Input() sortCriteria: 'id' | 'play_count' = 'id';
  @Input() filterFn: (song: Song) => boolean = () => true;
  // New input property to receive album songs from the parent component.
  @Input() albumSongs: Song[] = [];
  songId!: number;
  songs!: Observable<Song[]>;
  openMenuSongId: number | null = null;

  constructor(
    private songsState: SongsStateService,
    private songData: PlayerStateService,
    private helper: SortService,
    private playlistService: PlaylistStateService
  ) {}

  ngOnInit(): void {
    this.updateSongs();
    this.songData.songId$.subscribe((songId) => {
      this.songId = songId;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSongs();
  }

  private updateSongs(): void {
    if (this.playlist && this.playlist.songIds) {
      // Use playlist songs.
      this.songs = this.songsState.songs$.pipe(
        map((songs) => {
          const filtered = this.playlistService
            .getSongsByPlaylistIds(this.playlist!.songIds, songs)
            .filter(this.filterFn);
          return filtered;
        })
      );
    } else if (this.albumSongs && this.albumSongs.length > 0) {
      // Use albumSongs provided from the album component.
      this.songs = this.songsState.songs$.pipe(
        map(() => {
          return this.albumSongs.filter(this.filterFn);
        })
      );
    } else {
      // Clear any stored playlist songs so full songs list is used.
      this.songs = this.songsState.songs$.pipe(
        map(() => {
          const sortedSongs = this.helper.sortSongs(this.sortCriteria);
          return sortedSongs.filter(this.filterFn);
        })
      );
    }
  }

  toggleMenu(songId: number): void {
    this.openMenuSongId = this.openMenuSongId === songId ? null : songId;
  }

  trackBySongId(index: number, song: Song): number {
    return song.id;
  }
}

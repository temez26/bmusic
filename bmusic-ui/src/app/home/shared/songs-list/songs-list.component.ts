import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayComponent } from './play/play.component';
import { MenuComponent } from './menu/menu.component';
import { CommonModule } from '@angular/common';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { Song } from '../../../service/models/song.interface';
import { Playlist } from '../../../service/models/playlist.interface';

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

  songs!: Observable<Song[]>;
  openMenuSongId: number | null = null;

  constructor(private songsState: SongsStateService) {}

  ngOnInit(): void {
    this.updateSongs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSongs();
  }

  private updateSongs(): void {
    if (this.playlist && this.playlist.songIds) {
      // Use playlist songs.
      this.songs = this.songsState.songs$.pipe(
        map(() => {
          const filtered = this.songsState
            .getSongsByPlaylistIds(this.playlist!.songIds)
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
      this.songsState.clearPlaylistSongs();
      this.songs = this.songsState.songs$.pipe(
        map(() => {
          const sortedSongs = this.songsState.sortSongs(this.sortCriteria);
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

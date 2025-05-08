import {
  Component,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PlayComponent } from './play/play.component';
import { MenuComponent } from './menu/menu.component';
import {
  PlaylistStateService,
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
export class SongsListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() playlist?: Playlist;
  @Input() sortCriteria: 'id' | 'play_count' = 'id';
  @Input() filterFn: (song: Song) => boolean = () => true;
  @Input() inputSongs: any;
  songId!: number;
  songs: Song[] = []; // Change to array instead of Observable
  openMenuSongId: number | null = null;
  private subscriptions = new Subscription();

  constructor(
    private songsState: SongsStateService,
    private songData: PlayerStateService,

    private playlistService: PlaylistStateService
  ) {}

  ngOnInit(): void {
    this.updateSongs();

    const songIdSub = this.songData.songId$.subscribe((songId) => {
      this.songId = songId;
    });
    this.subscriptions.add(songIdSub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputSongs'] || changes['playlist']) {
      this.updateSongs();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateSongs(): void {
    if (this.playlist && this.playlist.songIds) {
      // Use playlist songs
      const songsSub = this.songsState.songs$.subscribe((allSongs) => {
        this.songs = this.playlistService
          .getSongsByPlaylistIds(this.playlist!.songIds, allSongs)
          .filter(this.filterFn);
      });
      this.subscriptions.add(songsSub);
    } else if (this.inputSongs && this.inputSongs.length > 0) {
      // Directly assign the array
      this.songs = this.inputSongs;
    } else {
      // Default case
      // Default case
      const songsSub = this.songsState.songs$.subscribe((allSongs) => {
        this.songs = allSongs.filter(this.filterFn);
      });
      this.subscriptions.add(songsSub);
    }
  }

  toggleMenu(songId: number): void {
    this.openMenuSongId = this.openMenuSongId === songId ? null : songId;
  }

  trackBySongId(index: number, song: Song): number {
    return song.id;
  }
}

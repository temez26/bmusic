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
export class SongsListComponent implements OnInit {
  @Input() playlist?: Playlist;
  @Input() inputSongs: any;
  songId!: number;
  songs: Song[] = [];
  openMenuSongId: number | null = null;
  private subscriptions = new Subscription();

  constructor(
    private songsState: SongsStateService,
    private songData: PlayerStateService,

    private playlistService: PlaylistStateService
  ) {}

  ngOnInit(): void {
    this.updateSongs();
    // Handles the currently playing song check
    const songIdSub = this.songData.songId$.subscribe((songId) => {
      this.songId = songId;
    });
    this.subscriptions.add(songIdSub);
    console.log(this.inputSongs);
  }
  hasArtistData(): boolean {
    return this.songs?.some((song) => song.artist && song.artist.trim() !== '');
  }

  hasAlbumData(): boolean {
    return this.songs?.some((song) => song.album && song.album.trim() !== '');
  }
  private updateSongs(): void {
    this.songs = this.inputSongs;
  }
  toggleMenu(songId: number): void {
    this.openMenuSongId = this.openMenuSongId === songId ? null : songId;
  }

  trackBySongId(index: number, song: Song): number {
    return song.id;
  }
}

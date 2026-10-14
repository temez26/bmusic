import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { PlaybackService } from '@features/play-song';
import { SongMenuComponent } from '@features/song-menu';
import { PlayerStore } from '@entities/player';
import { Song, SongTileComponent } from '@entities/song';

@Component({
  selector: 'app-songs-table',
  standalone: true,
  imports: [SongTileComponent, SongMenuComponent],
  templateUrl: './songs-table.component.html',
  styleUrl: './songs-table.component.scss',
})
export class SongsTableComponent {
  /** Songs to show; clicking one plays it with this list as the queue. */
  @Input({ required: true }) songs: Song[] = [];
  @Input() emptyText = 'No songs here yet. Use the upload button to add music.';
  @Output() playlistsChanged = new EventEmitter<void>();

  private readonly playback = inject(PlaybackService);
  private readonly player = inject(PlayerStore);

  readonly currentSongId = computed(() => this.player.current()?.id ?? null);
  readonly openMenuSongId = signal<number | null>(null);

  play(song: Song): void {
    this.playback.play(song, this.songs);
  }

  setMenuOpen(songId: number, open: boolean): void {
    this.openMenuSongId.set(open ? songId : null);
  }
}

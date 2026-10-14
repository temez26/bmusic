import { Component, computed, inject } from '@angular/core';
import { PlaybackService } from '@features/play-song';
import { Song, SongStore, SongTileComponent } from '@entities/song';

const TOP_COUNT = 15;

@Component({
  selector: 'app-top-songs',
  standalone: true,
  imports: [SongTileComponent],
  templateUrl: './top-songs.component.html',
  styleUrl: './top-songs.component.scss',
})
export class TopSongsComponent {
  private readonly songStore = inject(SongStore);
  private readonly playback = inject(PlaybackService);

  readonly songs = computed(() =>
    [...this.songStore.songs()]
      .filter((song) => song.play_count > 0)
      .sort((a, b) => b.play_count - a.play_count)
      .slice(0, TOP_COUNT)
  );

  play(song: Song): void {
    this.playback.play(song, this.songs());
  }
}

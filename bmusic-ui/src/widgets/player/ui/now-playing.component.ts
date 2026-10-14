import { Component, Input } from '@angular/core';
import { coverUrl } from '@shared/api';
import type { Song } from '@entities/song';

@Component({
  selector: 'app-now-playing',
  standalone: true,
  templateUrl: './now-playing.component.html',
  styleUrl: './now-playing.component.scss',
})
export class NowPlayingComponent {
  @Input() song: Song | null = null;

  get cover(): string {
    return coverUrl(this.song?.album_cover_url);
  }
}

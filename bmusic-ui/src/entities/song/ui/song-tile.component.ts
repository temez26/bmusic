import { Component, Input } from '@angular/core';
import { coverUrl } from '@shared/api';
import { Song } from '../model/song';

/** Cover art and title of a song. Click handling belongs to the parent. */
@Component({
  selector: 'app-song-tile',
  standalone: true,
  templateUrl: './song-tile.component.html',
  styleUrl: './song-tile.component.scss',
})
export class SongTileComponent {
  @Input({ required: true }) song!: Song;
  @Input() variant: 'row' | 'card' = 'row';

  get cover(): string {
    return coverUrl(this.song.album_cover_url);
  }
}

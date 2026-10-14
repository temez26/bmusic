import { Component, inject } from '@angular/core';
import { SongsTableComponent } from '@widgets/songs-table';
import { SongStore } from '@entities/song';

@Component({
  selector: 'app-songs-page',
  standalone: true,
  imports: [SongsTableComponent],
  templateUrl: './songs-page.component.html',
  styleUrl: './songs-page.component.scss',
})
export class SongsPageComponent {
  readonly songs = inject(SongStore).songs;
}

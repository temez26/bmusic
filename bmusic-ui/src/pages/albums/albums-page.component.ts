import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlbumStore } from '@entities/album';
import { coverUrl } from '@shared/api';

@Component({
  selector: 'app-albums-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './albums-page.component.html',
  styleUrl: './albums-page.component.scss',
})
export class AlbumsPageComponent {
  readonly albums = inject(AlbumStore).albums;
  readonly coverUrl = coverUrl;
}

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArtistStore } from '@entities/artist';

@Component({
  selector: 'app-artists-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './artists-page.component.html',
  styleUrl: './artists-page.component.scss',
})
export class ArtistsPageComponent {
  readonly artists = inject(ArtistStore).artists;
}

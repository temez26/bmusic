import { Injectable, inject, signal } from '@angular/core';
import { ArtistApi } from '../api/artist.api';
import { Artist } from './artist';

@Injectable({ providedIn: 'root' })
export class ArtistStore {
  private readonly api = inject(ArtistApi);
  private readonly state = signal<Artist[]>([]);

  readonly artists = this.state.asReadonly();

  load(): void {
    this.api.getAll().subscribe({
      next: (artists) => this.state.set(artists),
      error: (err) => console.error('Failed to load artists', err),
    });
  }
}

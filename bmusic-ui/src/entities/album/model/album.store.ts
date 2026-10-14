import { Injectable, inject, signal } from '@angular/core';
import { AlbumApi } from '../api/album.api';
import { Album } from './album';

@Injectable({ providedIn: 'root' })
export class AlbumStore {
  private readonly api = inject(AlbumApi);
  private readonly state = signal<Album[]>([]);

  readonly albums = this.state.asReadonly();

  load(): void {
    this.api.getAll().subscribe({
      next: (albums) => this.state.set(albums),
      error: (err) => console.error('Failed to load albums', err),
    });
  }
}

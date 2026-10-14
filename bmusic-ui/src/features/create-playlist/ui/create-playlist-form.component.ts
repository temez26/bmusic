import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Playlist, PlaylistApi } from '@entities/playlist';

@Component({
  selector: 'app-create-playlist-form',
  standalone: true,
  templateUrl: './create-playlist-form.component.html',
  styleUrl: './create-playlist-form.component.scss',
})
export class CreatePlaylistFormComponent {
  @Output() created = new EventEmitter<Playlist>();

  private readonly api = inject(PlaylistApi);
  readonly error = signal('');

  submit(name: HTMLInputElement, description: HTMLInputElement): void {
    if (!name.value.trim()) return;

    this.api.create(name.value.trim(), description.value.trim()).subscribe({
      next: (playlist) => {
        name.value = '';
        description.value = '';
        this.error.set('');
        this.created.emit(playlist);
      },
      error: (err: HttpErrorResponse) =>
        this.error.set(
          err.status === 409 ? 'A playlist with that name already exists.' : 'Could not create playlist.'
        ),
    });
  }
}

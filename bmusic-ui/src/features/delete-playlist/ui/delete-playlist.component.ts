import { Component, EventEmitter, HostListener, Input, Output, inject, signal } from '@angular/core';
import { Playlist, PlaylistApi } from '@entities/playlist';

@Component({
  selector: 'app-delete-playlist',
  standalone: true,
  templateUrl: './delete-playlist.component.html',
  styleUrl: './delete-playlist.component.scss',
})
export class DeletePlaylistComponent {
  @Input({ required: true }) playlist!: Playlist;
  @Output() deleted = new EventEmitter<void>();

  private readonly api = inject(PlaylistApi);
  readonly isOpen = signal(false);

  delete(): void {
    if (!confirm(`Delete playlist "${this.playlist.name}"? Songs stay in the library.`)) {
      return;
    }
    this.api.delete(this.playlist.id).subscribe({
      next: () => this.deleted.emit(),
      error: (err) => console.error('Failed to delete playlist', err),
    });
    this.isOpen.set(false);
  }

  @HostListener('mouseleave')
  close(): void {
    this.isOpen.set(false);
  }
}

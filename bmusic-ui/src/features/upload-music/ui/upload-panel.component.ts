import { Component, inject, signal } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { AlbumStore } from '@entities/album';
import { ArtistStore } from '@entities/artist';
import { SongStore } from '@entities/song';
import { UploadApi } from '../api/upload.api';

@Component({
  selector: 'app-upload-panel',
  standalone: true,
  templateUrl: './upload-panel.component.html',
  styleUrl: './upload-panel.component.scss',
})
export class UploadPanelComponent {
  private readonly api = inject(UploadApi);
  private readonly songs = inject(SongStore);
  private readonly albums = inject(AlbumStore);
  private readonly artists = inject(ArtistStore);

  readonly selectedFiles = signal<File[]>([]);
  readonly progress = signal<number | null>(null);
  readonly message = signal('');
  readonly error = signal('');

  addFiles(input: HTMLInputElement): void {
    const files = Array.from(input.files ?? []);
    this.selectedFiles.update((current) => [...current, ...files]);
    this.message.set('');
    this.error.set('');
    input.value = '';
  }

  upload(): void {
    const files = this.selectedFiles();
    if (!files.length || this.progress() !== null) return;

    this.progress.set(0);
    this.api.upload(files).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress.set(Math.round((100 * event.loaded) / event.total));
        } else if (event.type === HttpEventType.Response && event.body) {
          const { uploaded, failed } = event.body;
          this.message.set(`Uploaded ${uploaded.length} song(s).`);
          this.error.set(failed.length ? `Skipped: ${failed.map((f) => f.file).join(', ')}` : '');
          this.selectedFiles.set([]);
          this.progress.set(null);
          this.songs.load();
          this.albums.load();
          this.artists.load();
        }
      },
      error: () => {
        this.error.set('Upload failed. Is the API running?');
        this.progress.set(null);
      },
    });
  }
}

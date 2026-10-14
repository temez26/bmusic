import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlaybackService } from '@features/play-song';
import { SongSearchComponent } from '@features/search-songs';
import { UploadPanelComponent } from '@features/upload-music';
import { Song } from '@entities/song';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, SongSearchComponent, UploadPanelComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly playback = inject(PlaybackService);

  readonly showUpload = signal(false);

  play(song: Song): void {
    this.playback.play(song);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.showUpload() && !target.closest('.upload-area')) {
      this.showUpload.set(false);
    }
  }
}

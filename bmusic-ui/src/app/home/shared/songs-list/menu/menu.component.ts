import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../service/api.service';
import { ApiPlaylistService } from '../../../../service/api-playlist.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() isMenuOpen: boolean = false;
  @Input() songId!: number;
  @Output() toggleMenu = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private apiService: ApiService,
    private apiPlaylistService: ApiPlaylistService
  ) {}

  onToggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.toggleMenu.emit();
  }
  onDeleteSong() {
    if (this.songId) {
      console.log(this.songId);
      this.apiService.deleteSong(this.songId).subscribe({
        next: () => {
          this.toggleMenu.emit();
        },
        error: (error) => console.error('Error deleting song:', error),
      });
    }
  }
  onAddSongFavorites(songId: number) {
    if (songId) {
      console.log(songId);
      this.apiPlaylistService.addSongToPlaylist(1, songId).subscribe();
    }
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.isMenuOpen &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.toggleMenu.emit();
    }
  }
}

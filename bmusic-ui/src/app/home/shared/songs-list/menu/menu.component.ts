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
import { Playlist } from '../../../../service/models/playlist.interface';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() songId!: number;
  @Input() isMenuOpen: boolean = false;
  @Output() toggleMenu = new EventEmitter<void>();

  // New properties for playlist dropdown
  isPlaylistDropdownOpen = false;
  playlists: Playlist[] = [];

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
      this.apiPlaylistService.addSongToPlaylist(1, songId).subscribe();
    }
  }

  // Methods for playlist dropdown on hover
  showPlaylistDropdown() {
    this.isPlaylistDropdownOpen = true;
    // Fetch playlists and limit to 5
    this.apiPlaylistService.fetchPlaylists().subscribe({
      next: (data: Playlist[]) => {
        this.playlists = data.filter((p) => p.id !== 1).slice(0, 5);
      },
      error: (error) => console.error('Error fetching playlists:', error),
    });
  }

  hidePlaylistDropdown() {
    this.isPlaylistDropdownOpen = false;
  }

  keepPlaylistDropdownOpen() {
    this.isPlaylistDropdownOpen = true;
  }

  addSongToPlaylist(playlistId: number) {
    this.apiPlaylistService
      .addSongToPlaylist(playlistId, this.songId)
      .subscribe({
        next: () => {
          console.log(`Song added to playlist ${playlistId}`);
          // Optionally close the dropdown after adding.
          this.isPlaylistDropdownOpen = false;
          this.toggleMenu.emit();
        },
        error: (error) =>
          console.error('Error adding song to playlist:', error),
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
      this.isPlaylistDropdownOpen = false;
    }
  }
}

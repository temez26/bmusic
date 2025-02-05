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
import { Song } from '../../../../service/models/song.interface';

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

  // Properties for playlist dropdown and membership flags.
  isPlaylistDropdownOpen = false;
  playlists: Playlist[] = [];
  // Maps playlist ID to a flag indicating whether the song is already in that playlist.
  membership: { [playlistId: number]: boolean } = {};

  constructor(
    private elementRef: ElementRef,
    private apiService: ApiService,
    private apiPlaylistService: ApiPlaylistService
  ) {}

  onToggleMenu(event: MouseEvent) {
    event.stopPropagation();
    // Update favorites membership when toggling the menu.
    this.updateFavoritesMembership();
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

  // Remove previous onAddSongFavorites method if no longer needed.
  // New toggleFavorites method for playlist id = 1
  toggleFavorites() {
    this.apiPlaylistService.fetchPlaylistSongs(1).subscribe({
      next: (songs: Song[]) => {
        const exists = songs.some((song) => song.id === this.songId);
        if (exists) {
          this.apiPlaylistService
            .removeSongFromPlaylist(1, this.songId)
            .subscribe({
              next: () => {
                console.log('Song removed from Favorites');
                this.membership[1] = false;
                this.isMenuOpen = false;
                this.isPlaylistDropdownOpen = false;
                this.toggleMenu.emit();
              },
              error: (error) =>
                console.error('Error removing song from Favorites:', error),
            });
        } else {
          this.apiPlaylistService.addSongToPlaylist(1, this.songId).subscribe({
            next: () => {
              console.log('Song added to Favorites');
              this.membership[1] = true;
              this.isMenuOpen = false;
              this.isPlaylistDropdownOpen = false;
              this.toggleMenu.emit();
            },
            error: (error) =>
              console.error('Error adding song to Favorites:', error),
          });
        }
      },
      error: (error) => console.error('Error fetching Favorites songs:', error),
    });
  }

  updateFavoritesMembership() {
    this.apiPlaylistService.fetchPlaylistSongs(1).subscribe({
      next: (songs: Song[]) => {
        this.membership[1] = songs.some((s) => s.id === this.songId);
      },
      error: (error) =>
        console.error('Error updating Favorites membership:', error),
    });
  }

  showPlaylistDropdown() {
    this.isPlaylistDropdownOpen = true;
    this.apiPlaylistService.fetchPlaylists().subscribe({
      next: (data: Playlist[]) => {
        // Exclude favorites (playlist id 1) and limit to 5 playlists.
        this.playlists = data.filter((p) => p.id !== 1).slice(0, 5);
        this.playlists.forEach((p) => {
          this.apiPlaylistService.fetchPlaylistSongs(p.id).subscribe({
            next: (songs: Song[]) => {
              this.membership[p.id] = songs.some((s) => s.id === this.songId);
            },
            error: (error) =>
              console.error(
                `Error checking membership for playlist ${p.id}:`,
                error
              ),
          });
        });
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

  toggleSongInPlaylist(playlistId: number) {
    this.apiPlaylistService.fetchPlaylistSongs(playlistId).subscribe({
      next: (songs: Song[]) => {
        const exists = songs.some((song) => song.id === this.songId);
        if (exists) {
          this.apiPlaylistService
            .removeSongFromPlaylist(playlistId, this.songId)
            .subscribe({
              next: () => {
                console.log(`Song removed from playlist ${playlistId}`);
                this.membership[playlistId] = false;
                this.isPlaylistDropdownOpen = false;
                this.toggleMenu.emit();
              },
              error: (error) =>
                console.error('Error removing song from playlist:', error),
            });
        } else {
          this.apiPlaylistService
            .addSongToPlaylist(playlistId, this.songId)
            .subscribe({
              next: () => {
                console.log(`Song added to playlist ${playlistId}`);
                this.membership[playlistId] = true;
                this.isPlaylistDropdownOpen = false;
                this.toggleMenu.emit();
              },
              error: (error) =>
                console.error('Error adding song to playlist:', error),
            });
        }
      },
      error: (error) =>
        console.error('Error fetching playlist songs for toggle:', error),
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

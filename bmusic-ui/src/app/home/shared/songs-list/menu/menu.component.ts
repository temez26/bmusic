import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Song,
  Playlist,
  ApiPlaylistService,
  ApiService,
} from '../../../../service';

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
  @ViewChild('notificationRef', { static: false })
  notificationElement!: ElementRef;
  // Properties for playlist dropdown and membership flags.
  isPlaylistDropdownOpen = false;
  playlists: Playlist[] = [];
  // Maps playlist ID to a flag indicating whether the song is already in that playlist.
  membership: { [playlistId: number]: boolean } = {};
  notificationMessage: string = '';
  constructor(
    private elementRef: ElementRef,
    private apiService: ApiService,
    private apiPlaylistService: ApiPlaylistService,
    private cd: ChangeDetectorRef
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

  showNotification(message: string): void {
    this.notificationMessage = message;
    this.cd.detectChanges();

    // Wait for 2 seconds then trigger fade out by adding a "fade-out" class to the notification element.
    setTimeout(() => {
      if (this.notificationElement) {
        this.notificationElement.nativeElement.classList.add('fade-out');
      }
      // After your fade-out transition (0.5s), clear the notification.
      setTimeout(() => {
        this.notificationMessage = '';
        // Reset the fade-out class if needed for next time.
        if (this.notificationElement) {
          this.notificationElement.nativeElement.classList.remove('fade-out');
        }
        this.cd.detectChanges();
      }, 500);
    }, 2000);
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
                this.membership[1] = false;
                this.isMenuOpen = false;
                this.isPlaylistDropdownOpen = false;
                this.showNotification('Song removed from Favorites');
                this.toggleMenu.emit();
              },
              error: (error) =>
                console.error('Error removing song from Favorites:', error),
            });
        } else {
          this.apiPlaylistService.addSongToPlaylist(1, this.songId).subscribe({
            next: () => {
              this.membership[1] = true;
              this.isMenuOpen = false;
              this.isPlaylistDropdownOpen = false;
              this.showNotification('Song added to Favorites');
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
    // Look up the playlist name from the loaded playlists array.
    const playlist = this.playlists.find((p) => p.id === playlistId);
    const playlistName = playlist ? playlist.name : `#${playlistId}`;

    this.apiPlaylistService.fetchPlaylistSongs(playlistId).subscribe({
      next: (songs: Song[]) => {
        const exists = songs.some((song) => song.id === this.songId);
        if (exists) {
          this.apiPlaylistService
            .removeSongFromPlaylist(playlistId, this.songId)
            .subscribe({
              next: () => {
                this.membership[playlistId] = false;
                this.isPlaylistDropdownOpen = false;
                // Show notification for removal using the playlist name.
                this.showNotification(
                  `Song removed from playlist ${playlistName}`
                );
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
                this.membership[playlistId] = true;
                this.isPlaylistDropdownOpen = false;
                // Show notification for addition using the playlist name.
                this.showNotification(`Song added to playlist ${playlistName}`);
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

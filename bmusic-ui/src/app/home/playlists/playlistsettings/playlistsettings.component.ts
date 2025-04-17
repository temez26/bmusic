import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { ApiPlaylistService } from '../../../service/apiCalls/api-playlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlist-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlistsettings.component.html',
  styleUrls: ['./playlistsettings.component.scss'],
})
export class PlaylistSettingsComponent {
  @Input() playlistId!: number;
  @Output() playlistDeleted = new EventEmitter<void>();
  isDropdownOpen = false;

  constructor(private apiPlaylistService: ApiPlaylistService) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  deletePlaylist() {
    this.apiPlaylistService.deletePlaylist(this.playlistId).subscribe({
      next: () => {
        this.playlistDeleted.emit();
        this.isDropdownOpen = false;
      },
      error: (error) => console.error('Error deleting playlist:', error),
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isDropdownOpen = false;
  }
}

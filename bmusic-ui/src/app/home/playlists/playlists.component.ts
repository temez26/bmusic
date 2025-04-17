import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaylistSettingsComponent } from './playlistsettings/playlistsettings.component';
import { Playlist, ApiPlaylistService } from '../../service';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PlaylistSettingsComponent],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];
  newPlaylistName = '';
  newPlaylistDescription = '';

  selectedPlaylistId?: number;
  songIdToAdd?: number;

  constructor(private apiService: ApiPlaylistService) {}

  ngOnInit(): void {
    this.fetchPlaylists();
  }

  fetchPlaylists(): void {
    (this.apiService.fetchPlaylists() as Observable<Playlist[]>).subscribe({
      next: (data: Playlist[]) => {
        this.playlists = data;
      },
      error: (error) => {
        console.error('Error fetching playlists', error);
      },
    });
  }

  createPlaylist(): void {
    // Assuming user id 1 for testing purposes
    const created_by = 1;
    this.apiService
      .createPlaylist(
        this.newPlaylistName,
        this.newPlaylistDescription,
        created_by
      )
      .subscribe({
        next: (playlist: Playlist) => {
          this.playlists.push(playlist);
          // Clear form inputs
          this.newPlaylistName = '';
          this.newPlaylistDescription = '';
        },
        error: (error) => {
          console.error('Error creating playlist', error);
        },
      });
  }

  addSongToPlaylist(): void {
    if (!this.selectedPlaylistId || !this.songIdToAdd) {
      console.error('Please select a playlist and provide a song id.');
      return;
    }
    this.apiService.addSongToPlaylist(
      this.selectedPlaylistId,
      this.songIdToAdd
    );
  }

  // New method to select a specific playlist
  selectPlaylist(playlistId: number): void {
    this.selectedPlaylistId = playlistId;
  }
  deletePlaylist(playlistId: number) {
    this.apiService.deletePlaylist(playlistId);
  }
  onPlaylistDeleted() {
    this.fetchPlaylists();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsListComponent } from '../../shared/songs-list/songs-list.component';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { ApiPlaylistService } from '../../../service/api-playlist.service';
import { Playlist } from '../../../service/models/playlist.interface';
import { Song } from '../../../service/models/song.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, SongsListComponent],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  playlistId = 0;
  // Note: If the API returns an array of songs instead of a Playlist object,
  // you need to transform the data to match the Playlist interface.
  playlist!: Playlist;

  // Declare playlists array
  playlists!: Playlist;

  // Filter function to only match songs in this playlist
  playlistFilter = (song: Song): boolean => {
    return !!this.playlist?.songIds?.includes(song.id);
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiPlaylistService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('playlistId');

      if (idParam) {
        this.playlistId = +idParam;
        console.log(this.playlistId);
        this.fetchPlaylists();
        this.apiService.fetchPlaylistSongs(this.playlistId).subscribe({
          next: (data: unknown) => {
            // If the API returns an array of songs rather than a Playlist object,
            // transform it into a Playlist object.
            const songs = data as Song[];
            this.playlist = {
              ...this.playlist,
              songIds: songs.map((song) => song.id),
            };
            console.log('Loaded playlist:', this.playlist);
          },
          error: (error) => console.error('Error fetching playlist', error),
        });
      }
    });
  }

  fetchPlaylists(): void {
    (this.apiService.fetchPlaylists() as Observable<Playlist[]>).subscribe({
      next: (data: Playlist[]) => {
        this.playlists = data[this.playlistId - 1];
        console.log(this.playlists);
      },
      error: (error) => {
        console.error('Error fetching playlists', error);
      },
    });
  }
}

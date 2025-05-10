import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsListComponent } from '../../shared/songs-list/songs-list.component';
import { Song, ApiPlaylistService } from '../../../service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, SongsListComponent],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  playlistId = 0;
  songs!: Song[];
  playlist: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiPlaylistService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('playlistId');

      if (idParam) {
        this.playlistId = +idParam;
        this.isLoading = true;
        this.apiService.fetchPlaylists().subscribe((playlists) => {
          const playlist = playlists.find((pl) => pl.id === this.playlistId);
          if (playlist) {
            this.playlist = playlist;
          } else {
            console.log('not found playlist with id:', this.playlistId);
          }
        });

        this.apiService
          .fetchPlaylistSongs(this.playlistId)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: (songs) => {
              this.songs = songs;
            },
            error: (err) => console.error('Error loading songs:', err),
          });
      }
    });
  }
}

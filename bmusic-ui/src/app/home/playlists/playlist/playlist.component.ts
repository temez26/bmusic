import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsListComponent } from '../../shared/songs-list/songs-list.component';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { ApiPlaylistService } from '../../../service/api-playlist.service';
import { Playlist } from '../../../service/models/playlist.interface';
import { Song } from '../../../service/models/song.interface';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, SongsListComponent],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  playlistId = 0;
  playlist?: Playlist;

  // Filter function to only match songs in this playlist
  playlistFilter = (song: Song): boolean => {
    console.log(this.playlist?.songIds?.includes(song.id));
    return !!this.playlist?.songIds?.includes(song.id);
  };

  constructor(
    private route: ActivatedRoute,
    private songsState: SongsStateService,
    private apiPlaylistService: ApiPlaylistService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('playlistId');
      if (idParam) {
        this.playlistId = +idParam;
        this.apiPlaylistService.fetchPlaylistSongs(this.playlistId).subscribe({
          next: (data: unknown) => {
            this.playlist = data as Playlist;
            console.log('Loaded playlist:', this.playlist);
          },
          error: (error) => console.error('Error fetching playlist', error),
        });
      }
    });
  }
}

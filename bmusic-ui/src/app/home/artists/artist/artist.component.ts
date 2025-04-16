import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { ArtistStateService } from '../../../service/states/artist.state.service';
import { Song } from '../../../service/models/song.interface';
import { ApiService } from '../../../service/apiCalls/api.service';
import { AlbumStateService } from '../../../service/states/album.state.service';
import { SongsListComponent } from '../../shared/songs-list/songs-list.component';
import { SortService } from '../../../service/states/shared/sort.service';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, SongsListComponent],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {
  public artistId: number = 0;
  public songs: Song[] = [];
  public artist: any = {};
  public coverSrc: string = '';

  public artistFilter = (song: Song): boolean =>
    song.artist_id === this.artistId;

  constructor(
    private route: ActivatedRoute,
    private songsState: SongsStateService,
    private artistState: ArtistStateService,
    private apiService: ApiService,
    private albumState: AlbumStateService,
    private helper: SortService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('artistId');
      if (idParam) {
        this.artistId = +idParam;
        this.artist = this.artistState.getCurrentArtist();
      }
    });

    this.apiService.fetchAlbums().subscribe(() => {
      this.coverSrc = this.albumState.getAlbumCover(this.artistId);
    });

    this.songsState.songs$.subscribe(() => {
      const artistSongs = this.helper
        .sortSongs('id')
        .filter((song) => song.artist_id === this.artistId);

      // Clean up the genre field if applicable
      artistSongs.forEach((song) => {
        if (song.genre) {
          song.genre = song.genre.replace(/[{}"]/g, '');
        }
      });

      this.songs = artistSongs;
      // Removed setting the current playlist; data is passed down as input.
      // this.songsState.setCurrentPlaylistSongs(artistSongs);
    });
  }
}

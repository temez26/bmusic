import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { ArtistStateService } from '../../../service/states/artist.state.service';
import { Song } from '../../../service/models/song.interface';
import { ApiService } from '../../../service/api.service';
import { AlbumStateService } from '../../../service/states/album.state.service';
import { SongsListComponent } from '../../shared/songs-list/songs-list.component';

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

  // Define the filter function as a public property
  public artistFilter = (song: Song): boolean =>
    song.artist_id === this.artistId;

  constructor(
    private route: ActivatedRoute,
    private songsState: SongsStateService,
    private artistState: ArtistStateService,
    private apiService: ApiService,
    private albumState: AlbumStateService
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
      this.songs = this.songsState
        .sortSongs('id')
        .filter((song) => song.artist_id === this.artistId);
      this.songs.forEach((song) => {
        if (song.genre) {
          song.genre = song.genre.replace(/[{}"]/g, '');
        }
      });
    });
  }
}

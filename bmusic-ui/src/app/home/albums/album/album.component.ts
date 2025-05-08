import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SongsListComponent } from '../../shared/songs-list/songs-list.component';
import {
  SortService,
  ApiService,
  AlbumStateService,
  Song,
  SongsStateService,
  Albums,
} from '../../../service';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, SongsListComponent],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss',
})
export class AlbumComponent implements OnInit {
  private albumId: number = 0;
  public coverSrc: string = '';
  public songs: Song[] = [];
  albumFilter = (song: any): boolean => song.album_id === this.albumId;

  constructor(
    private songsState: SongsStateService,
    private albumState: AlbumStateService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private helper: SortService
  ) {}

  ngOnInit(): void {
    // Get the albumId from the URL
    this.route.paramMap.subscribe((params) => {
      const albumIdParam = params.get('albumId');
      if (albumIdParam !== null) {
        this.albumId = +albumIdParam;
      }
    });

    this.apiService.fetchAlbums().subscribe(() => {
      this.coverSrc = this.albumState.getAlbumCover(this.albumId);
    });

    this.albumState.albums$.subscribe((albums) => {
      const album = albums.find((album) => album.id == this.albumId);

      if (album) {
        this.songs = album.songs;
      } else {
        this.songs = [];
      }
    });
  }
}

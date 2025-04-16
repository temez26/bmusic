import { Component, OnInit, OnDestroy } from '@angular/core';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { Song } from '../../../service/models/song.interface';
import { CommonModule } from '@angular/common';
import { AlbumStateService } from '../../../service/states/album.state.service';
import { ApiService } from '../../../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { SongsListComponent } from '../../shared/songs-list/songs-list.component';
import { HelperService } from '../../../service/states/helper.service';

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
    private helper: HelperService
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

    this.songsState.songs$.subscribe(() => {
      const albumSongs = this.helper
        .sortSongs('id')
        .filter((song) => song.album_id === this.albumId);
      this.songs = albumSongs;
      // Removed setting the current playlist here.
      // The songs list will be passed down via the albumSongs Input to the child components.
    });
  }
}

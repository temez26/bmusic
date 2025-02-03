import { Component, OnInit, OnDestroy } from '@angular/core';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { Song } from '../../../service/models/song.interface';
import { CommonModule } from '@angular/common';
import { PlayComponent } from '../../shared/songs-list/play/play.component';
import { MenuComponent } from '../../shared/songs-list/menu/menu.component';
import { AlbumStateService } from '../../../service/states/album.state.service';
import { ApiService } from '../../../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { SongsListComponent } from '../../shared/songs-list/songs-list.component';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //get the albumid from the url
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
      this.songs = this.songsState
        .sortSongs('id')
        .filter((song) => song.album_id === this.albumId);
    });
  }
}

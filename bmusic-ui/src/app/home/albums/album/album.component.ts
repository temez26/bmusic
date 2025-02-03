import { Component, OnInit, OnDestroy } from '@angular/core';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { Song } from '../../../service/models/song.interface';
import { CommonModule } from '@angular/common';
import { PlayComponent } from '../../shared/play/play.component';
import { MenuComponent } from '../../songs/menu/menu.component';
import { AlbumStateService } from '../../../service/states/album.state.service';
import { ApiService } from '../../../service/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, PlayComponent, MenuComponent],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss',
})
export class AlbumComponent implements OnInit {
  private albumId: number = 0;
  openMenuSongId: number | null = null;
  public coverSrc: string = '';
  public songs: Song[] = [];

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
  toggleMenu(songId: number) {
    if (this.openMenuSongId === songId) {
      this.openMenuSongId = null;
    } else {
      this.openMenuSongId = songId;
    }
  }
}

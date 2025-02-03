import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { ArtistStateService } from '../../../service/states/artist.state.service';
import { Song } from '../../../service/models/song.interface';
import { PlayComponent } from '../../shared/play/play.component';
import { MenuComponent } from '../../songs/menu/menu.component';
import { ApiService } from '../../../service/api.service';
import { AlbumStateService } from '../../../service/states/album.state.service';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, PlayComponent, MenuComponent],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {
  private artistId: number = 0;
  openMenuSongId: number | null = null;
  public songs: Song[] = [];
  public artist: any = {};
  public coverSrc: string = '';

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
        this.loadArtistSongs();
      }
    });
    this.apiService.fetchAlbums().subscribe(() => {
      this.coverSrc = this.albumState.getAlbumCover(this.artistId);
    });
  }
  toggleMenu(songId: number) {
    if (this.openMenuSongId === songId) {
      this.openMenuSongId = null;
    } else {
      this.openMenuSongId = songId;
    }
  }
  private loadArtistSongs(): void {
    this.songsState.songs$.subscribe(() => {
      this.songs = this.songsState
        .sortSongs('id')
        .filter((song: Song) => song.artist_id === this.artistId);
      this.songs.forEach((song) => {
        if (song.genre) {
          song.genre = song.genre.replace(/[{}"]/g, '');
        }
      });
    });
  }
}

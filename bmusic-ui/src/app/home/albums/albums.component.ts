import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumStateService } from '../../service/states/album.state.service';
import { Albums } from '../../service/models/album.interface';
import { environment } from '../../../environments/environment';
import { SongsStateService } from '../../service/states/songs.state.service';
import { Song } from '../../service/models/song.interface';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsComponent implements OnInit {
  albums: Albums[] = [];
  url: string = environment.apiBaseUrl;
  songs: Song[] = [];

  constructor(
    private albumState: AlbumStateService,
    private songsState: SongsStateService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.fetchAlbums().subscribe();
    this.albumState.albums$.subscribe((albums) => {
      this.albums = albums;
    });
  }

  setAlbum(albumId: number): void {
    this.albumState.setCurrentAlbum(albumId);
    this.router.navigate(['/album', albumId]);
  }
}

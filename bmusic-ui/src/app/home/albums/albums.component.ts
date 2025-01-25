import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumStateService } from '../../service/states/album.state.service';
import { Album } from '../../service/models/album.interface';
import { environment } from '../../../environments/environment';
import { PlayerStateService } from '../../service/states/player.state.service';
import { Song } from '../../service/models/song.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsComponent implements OnInit {
  albums: Album[] = [];
  url: string = environment.apiBaseUrl;
  songs: Song[] = [];

  constructor(
    private albumState: AlbumStateService,
    private stateService: PlayerStateService
  ) {}

  ngOnInit(): void {
    this.albumState.albums$.subscribe((albums) => {
      this.albums = albums;
      console.log(this.albums);
    });
  }

  getSongsByAlbum(albumId: number): void {
    this.songs = this.stateService.getSongsByAlbumId(albumId);
    console.log(this.songs);
  }
}

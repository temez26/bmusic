import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  ApiService,
  environment,
  Albums,
  AlbumStateService,
} from '../../service';

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

  constructor(
    private albumState: AlbumStateService,
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
    this.router.navigate(['/album', albumId]);
  }
}

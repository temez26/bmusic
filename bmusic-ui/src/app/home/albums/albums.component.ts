import { Component, OnInit } from '@angular/core';
import { AlbumStateService } from '../../service/states/album.state.service';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsComponent implements OnInit {
  constructor(private albumState: AlbumStateService) {}

  ngOnInit(): void {
    console.log(this.albumState.getAlbums());
  }
}

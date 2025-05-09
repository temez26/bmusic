import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SongsListComponent } from '../../shared/songs-list/songs-list.component';
import { ApiService, environment, sharedStatesService } from '../../../service';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, SongsListComponent],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss',
})
export class AlbumComponent implements OnInit {
  private albumId: number = 0;
  public coverSrc: any;
  public album: any;

  constructor(
    private albumState: sharedStatesService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.coverSrc = environment.apiBaseUrl;
  }

  ngOnInit(): void {
    // Get the albumId from the URL
    this.route.paramMap.subscribe((params) => {
      const albumIdParam = params.get('albumId');
      if (albumIdParam !== null) {
        this.albumId = +albumIdParam;
      }
    });

    this.apiService.fetchAlbums().subscribe();

    this.albumState.albums$.subscribe((albums) => {
      const album = albums.find((album) => album.id == this.albumId);
      this.coverSrc = this.getFullImageUrl(album?.songs[0].album_cover_url);

      if (album) {
        this.album = album;
      } else {
        this.album = [];
      }
    });
  }
  private getFullImageUrl(path: string | undefined): string | undefined {
    return path ? `${environment.apiBaseUrl}${path}` : './cd-cover.png';
  }
}

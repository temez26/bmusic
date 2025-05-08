import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsListComponent } from '../../shared/songs-list/songs-list.component';
import { Song, ArtistStateService } from '../../../service';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, SongsListComponent],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {
  public artistId: number = 0;
  public artist: any;
  public genre: string = '';

  public artistFilter = (song: Song): boolean =>
    song.artist_id === this.artistId;

  constructor(
    private route: ActivatedRoute,
    private artistState: ArtistStateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('artistId');
      if (idParam) {
        this.artistId = +idParam;
      }
    });
    this.artistState.artists$.subscribe(() => {
      this.artistState.setCurrentArtist(this.artistId);
      this.artist = this.artistState.getCurrentArtist();
      this.genre = this.formatGenre(this.artist.songs[0].genre);
    });
  }
  formatGenre(genre: string): string {
    if (!genre) return '';
    return genre.replace(/[{}"]/g, '');
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { ArtistStateService } from '../../../service/states/artist.state.service';
import { Song } from '../../../service/models/song.interface';
import { PlayComponent } from '../../shared/play/play.component';
import { MenuComponent } from '../../songs/menu/menu.component';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, PlayComponent, MenuComponent],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {
  private artistId: number = 0;
  public songs: Song[] = [];
  public artist: any = {}; // holds the artist details from the state
  public artistPicture: string = '';

  constructor(
    private route: ActivatedRoute,
    private songsState: SongsStateService,
    private artistState: ArtistStateService
  ) {}

  ngOnInit(): void {
    // Get the artist id from the route parameters (e.g., /artist/:artistId)
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('artistId');
      if (idParam) {
        this.artistId = +idParam;
        this.loadArtistSongs();
        this.loadArtistDetails();
      }
    });
  }

  private loadArtistSongs(): void {
    this.songsState.songs$.subscribe(() => {
      this.songs = this.songsState
        .sortSongs('id')
        .filter((song: Song) => song.artist_id === this.artistId);
    });
  }

  private loadArtistDetails(): void {
    this.artistState.artist$.subscribe((currentArtist) => {
      // Ensure the current artist's id matches the route parameter
      if (currentArtist && currentArtist.id === this.artistId) {
        this.artist = currentArtist;
        this.artistPicture = currentArtist.artworkUrl100 || '';
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ArtistStateService } from '../../service/states/artist.state.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
})
export class ArtistsComponent implements OnInit {
  // Our final combined data from the iTunes API
  artists: any[] = [];

  constructor(
    private artistState: ArtistStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // First subscribe to server-provided artist names, then for each artist,

    this.artistState.artists$
      .pipe(
        switchMap((serverArtists) => {
          // Call fetchArtists for each with the original id and name.
          const artistObservables = serverArtists.map((artist: any) =>
            this.artistState.fetchArtists({ id: artist.id, name: artist.name })
          );
          return forkJoin(artistObservables);
        }),
        map((results: any[][]) => results.flat())
      )
      .subscribe((combinedArtists) => {
        this.artists = combinedArtists;
        console.log('Fetched artists:', this.artists);
      });
  }
  setArtist(artistId: number, currentArtistImg: string) {
    this.artistState.setCurrentArtist(artistId, currentArtistImg);
    this.router.navigate(['/artist', artistId]);
  }
}

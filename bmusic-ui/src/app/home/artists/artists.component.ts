import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { sharedStatesService } from '../../service';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
})
export class ArtistsComponent implements OnInit {
  artists: any[] = [];

  constructor(
    private artistState: sharedStatesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.artistState.artists$.subscribe((artists) => {
      this.artists = artists;
    });
  }
  setArtist(artistId: number) {
    this.router.navigate(['/artist', artistId]);
  }
}

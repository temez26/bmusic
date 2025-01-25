import { Component, OnInit } from '@angular/core';
import { ArtistStateService } from '../../service/states/artist.state.service';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.scss',
})
export class ArtistsComponent implements OnInit {
  constructor(private artistState: ArtistStateService) {}

  ngOnInit(): void {
    console.log(this.artistState.getArtists());
  }
}

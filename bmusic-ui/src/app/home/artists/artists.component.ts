import { Component, OnInit } from '@angular/core';
import { ArtistStateService } from '../../service/states/artist.state.service';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.scss',
})
export class ArtistsComponent implements OnInit {
  constructor(
    private artistState: ArtistStateService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.fetchArtists().subscribe();
    console.log(this.artistState.getArtists());
  }
}

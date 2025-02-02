import { Component, OnInit } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayerComponent, NavbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'bmusic-ui';

  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.apiService.fetchSongs().subscribe();
    this.apiService.fetchArtists().subscribe();
  }
}

import { Component } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { SongsComponent } from './songs/songs.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayerComponent, SongsComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bmusic-ui';
}

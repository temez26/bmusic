import { Component } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayerComponent, NavbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bmusic-ui';
}

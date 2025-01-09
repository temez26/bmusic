import { Component } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { SongsComponent } from './songs/songs.component';
import { UploadComponent } from './upload/upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayerComponent, SongsComponent, UploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bmusic-ui';
}

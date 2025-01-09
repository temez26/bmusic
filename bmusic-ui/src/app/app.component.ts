import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { SongsComponent } from './songs/songs.component';
import { UploadComponent } from './upload/upload.component';
import { DeleteComponent } from './delete/delete.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayerComponent, SongsComponent, UploadComponent, DeleteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bmusic-ui';
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-album',
  standalone: true,
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent {
  @Input() albumCoverSrc: string = '';
  @Input() currentTitle: string | null = null;
  @Input() currentArtist: string | null = null;
}

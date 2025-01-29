import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-album',
  standalone: true,
  templateUrl: './album-cover.component.html',
  styleUrls: ['./album-cover.component.scss'],
})
export class AlbumCoverComponent {
  @Input() albumCoverSrc: string = '';
  @Input() currentTitle: string | null = null;
  @Input() currentArtist: string | null = null;
}

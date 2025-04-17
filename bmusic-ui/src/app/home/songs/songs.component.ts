import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongsListComponent } from '../shared/songs-list/songs-list.component';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, SongsListComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsComponent {}

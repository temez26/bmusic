import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SongsStateService } from '../../service/states/songs.state.service';
import { PlayComponent } from '../shared/play/play.component';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, PlayComponent, MenuComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsComponent implements OnInit {
  songs: Observable<any[]>;

  constructor(private songsState: SongsStateService) {
    this.songs = songsState.songs$;
  }

  ngOnInit() {
    this.songs = this.songsState.songs$.pipe(
      map(() => this.songsState.sortSongs('id'))
    );
  }

  trackBySongId(index: number, song: any): number {
    return song.id;
  }
}

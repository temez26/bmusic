import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerStateService } from '../../service/states/player.state.service';
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

  constructor(private playerStateService: PlayerStateService) {
    this.songs = playerStateService.songs$;
  }

  ngOnInit() {
    this.songs = this.playerStateService.songs$.pipe(
      map(() => this.playerStateService.sortSongs('id'))
    );
  }

  trackBySongId(index: number, song: any): number {
    return song.id;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayComponent } from './play/play.component';
import { MenuComponent } from './menu/menu.component';
import { CommonModule } from '@angular/common';
import { SongsStateService } from '../../../service/states/songs.state.service';
import { Song } from '../../../service/models/song.interface';

@Component({
  selector: 'app-songs-list',
  standalone: true,
  imports: [CommonModule, PlayComponent, MenuComponent],
  templateUrl: './songs-list.component.html',
  styleUrls: ['./songs-list.component.scss'],
})
export class SongsListComponent implements OnInit {
  @Input() sortCriteria: 'id' | 'play_count' = 'id';
  @Input() filterFn: (song: Song) => boolean = () => true;

  songs!: Observable<Song[]>;
  openMenuSongId: number | null = null;

  constructor(private songsState: SongsStateService) {}

  ngOnInit() {
    this.songs = this.songsState.songs$.pipe(
      map(() =>
        this.songsState.sortSongs(this.sortCriteria).filter(this.filterFn)
      )
    );
  }
  toggleMenu(songId: number) {
    this.openMenuSongId = this.openMenuSongId === songId ? null : songId;
  }
  trackBySongId(index: number, song: Song): number {
    return song.id;
  }
}

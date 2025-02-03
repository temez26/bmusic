import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayComponent } from '../play/play.component';
import { MenuComponent } from '../../songs/menu/menu.component';
import { CommonModule } from '@angular/common';
import { SongsStateService } from '../../../service/states/songs.state.service';

@Component({
  selector: 'app-songs-list',
  standalone: true,
  imports: [CommonModule, PlayComponent, MenuComponent],
  templateUrl: './songs-list.component.html',
  styleUrl: './songs-list.component.scss',
})
export class SongsListComponent {
  songs!: Observable<any[]>;
  openMenuSongId: number | null = null;
  constructor(private songsState: SongsStateService) {
    this.songs = songsState.songs$;
  }

  ngOnInit() {
    this.songs = this.songsState.songs$.pipe(
      map(() => this.songsState.sortSongs('id'))
    );
  }
  toggleMenu(songId: number) {
    if (this.openMenuSongId === songId) {
      this.openMenuSongId = null;
    } else {
      this.openMenuSongId = songId;
    }
  }
  trackBySongId(index: number, song: any): number {
    return song.id;
  }
}

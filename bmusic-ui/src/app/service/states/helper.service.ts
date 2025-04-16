import { Injectable } from '@angular/core';
import { SongsStateService } from './songs.state.service';
import { Song } from '../models/song.interface';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  songs!: Song[];
  constructor(private songsService: SongsStateService) {
    this.songsService.songs$.subscribe((songs) => {
      this.songs = songs;
    });
  }

  sortSongs(criteria: 'play_count' | 'id'): Song[] {
    const songs = this.songs;
    if (criteria === 'play_count') {
      return songs.sort((a, b) => b.play_count - a.play_count).slice(0, 15);
    } else if (criteria === 'id') {
      return songs.sort((a, b) => a.id - b.id);
    }
    return songs;
  }
}

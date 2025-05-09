import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongsListComponent } from '../shared/songs-list/songs-list.component';
import { ApiService, Song, SongsStateService } from '../../service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, SongsListComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent implements OnInit {
  songs!: Song[];
  isLoading = true;

  constructor(private api: ApiService, private songsState: SongsStateService) {}

  ngOnInit(): void {
    this.songsState.songs$.subscribe((songs) => {
      this.songs = songs;
    });

    this.api
      .fetchSongs()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        error: (err) => console.error('Error fetching songs:', err),
      });
  }
}

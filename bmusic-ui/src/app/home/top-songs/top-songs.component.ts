import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from '../shared/songs-list/play/play.component';
import { ApiService } from '../../service';

@Component({
  selector: 'app-top-songs',
  standalone: true,
  imports: [CommonModule, PlayComponent],
  templateUrl: './top-songs.component.html',
  styleUrl: './top-songs.component.scss',
})
export class TopSongsComponent implements OnInit {
  songs: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.fetchTopSongs().subscribe((songs) => {
      this.songs = songs;
    });
  }
}

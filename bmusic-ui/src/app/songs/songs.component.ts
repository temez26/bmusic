import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../player/player.service';
import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, DeleteComponent],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.scss',
})
export class SongsComponent implements OnInit {
  songs: any[] = [];

  constructor(private http: HttpClient, private playerService: PlayerService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.http
      .get<any[]>(`http://${window.location.hostname}:4000/songs`)
      .subscribe({
        next: (response) => {
          this.songs = response;
          console.log(response);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
        complete: () => {
          console.log('Request completed');
        },
      });
  }

  playSong(filePath: string) {
    this.playerService.setFilePath(filePath);
  }
}

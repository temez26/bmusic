import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../service/player.service';
import { DeleteComponent } from '../delete/delete.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, DeleteComponent],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.scss',
})
export class SongsComponent implements OnInit, OnDestroy {
  songs: any[] = [];

  private songsSubscription!: Subscription;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.songsSubscription = this.playerService.songs$.subscribe((songs) => {
      this.songs = songs;
    });
    this.playerService.fetchSongs().subscribe();
  }

  ngOnDestroy() {
    if (this.songsSubscription) {
      this.songsSubscription.unsubscribe();
    }
  }

  playSong(filePath: string, title: string) {
    this.playerService.setFilePath(filePath);
    this.playerService.setTitle(title);
  }

  onSongDeleted() {
    this.playerService.fetchSongs().subscribe();
  }
}

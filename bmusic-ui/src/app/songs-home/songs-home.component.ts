// filepath: /c:/Users/temek/Documents/GitHub/bmusic/bmusic-ui/src/app/songs-home/songs-home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../service/player.service';
import { CoverWsService } from '../service/coverws.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-songs',
  standalone: true,
  templateUrl: './songs-home.component.html',
  imports: [CommonModule],
  styleUrls: ['./songs-home.component.scss'],
})
export class SongsComponent implements OnInit, OnDestroy {
  songs: any[] = [];
  coverImageSrcMap: { [key: number]: string } = {};

  private songsSubscription!: Subscription;

  constructor(
    private playerService: PlayerService,
    private coverWsService: CoverWsService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.songsSubscription = this.playerService.songs$.subscribe((songs) => {
      this.songs = songs
        .sort((a, b) => b.play_count - a.play_count) // Sort songs by play_count in descending order
        .slice(0, 10); // Take the top 25 songs
      // Fetch covers for each song using CoverService
      this.songs.forEach((song) =>
        this.coverWsService
          .getCovers(song.id, song.album_cover_url)
          .then((imageSrc) => {
            this.coverImageSrcMap[song.id] = imageSrc;
          })
          .catch((error) => {
            console.error('Error fetching cover:', error);
          })
      );
    });
    this.playerService.fetchSongs().subscribe();
  }

  ngOnDestroy() {
    if (this.songsSubscription) {
      this.songsSubscription.unsubscribe();
    }
  }

  playSong(songId: number, filePath: string, title: string) {
    this.apiService.incrementPlayCount(songId).subscribe({
      next: (response) => {
        console.log('Play count incremented:', response.playCount);
        this.playerService.setFilePath(filePath);
        this.playerService.setTitle(title);
      },
      error: (error) => {
        console.error('Error incrementing play count:', error);
      },
    });
  }

  onSongDeleted() {
    this.playerService.fetchSongs().subscribe();
  }
}

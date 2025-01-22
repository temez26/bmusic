import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverWsService } from '../../service/websocket/coverws.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../service/api.service';
import { AudioService } from '../../service/player/audio.service';

@Component({
  selector: 'app-top-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-songs.component.html',
  styleUrl: './top-songs.component.scss',
})
export class TopSongsComponent implements OnInit, OnDestroy {
  songs: any[] = [];
  coverImageSrcMap: { [key: number]: string } = {};

  private songsSubscription!: Subscription;

  constructor(
    private coverWsService: CoverWsService,
    private apiService: ApiService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.songsSubscription = this.apiService.fetchSongs().subscribe((songs) => {
      this.songs = songs
        .sort((a, b) => b.play_count - a.play_count)
        .slice(0, 10); // Take the top 10 songs

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
  }

  ngOnDestroy() {
    if (this.songsSubscription) {
      this.songsSubscription.unsubscribe();
    }
  }

  playSong(
    songId: number,
    filePath: string,
    title: string,
    album_cover_url: string,
    artist: string
  ) {
    this.apiService.incrementPlayCount(songId).subscribe({
      next: (response) => {
        console.log('Play count incremented:', response.playCount);
        this.audioService.setData(
          songId,
          filePath,
          title,
          album_cover_url,
          artist
        );
      },
      error: (error) => {
        console.error('Error incrementing play count:', error);
      },
    });
  }
  onSongDeleted() {
    this.apiService.fetchSongs().subscribe();
  }
}

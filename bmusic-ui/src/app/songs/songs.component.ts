import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../service/player.service';
import { CoverWsService } from '../service/coverws.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../service/api.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
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
      this.songs = songs.sort((a, b) => a.id - b.id);
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

  playSong(
    songId: number,
    filePath: string,
    title: string,
    album_cover_url: string
  ) {
    this.apiService.incrementPlayCount(songId).subscribe({
      next: (response) => {
        console.log('Play count incremented:', response.playCount);
        this.playerService.setData(songId, filePath, title, album_cover_url);
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

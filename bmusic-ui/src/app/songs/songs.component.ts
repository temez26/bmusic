import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../service/player.service';
import { CoverWsService } from '../service/coverws.service';
import { DeleteComponent } from '../delete/delete.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, DeleteComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent implements OnInit, OnDestroy {
  songs: any[] = [];
  coverImageSrcMap: { [key: number]: string } = {};

  private songsSubscription!: Subscription;

  constructor(
    private playerService: PlayerService,
    private coverWsService: CoverWsService
  ) {}

  ngOnInit() {
    this.songsSubscription = this.playerService.songs$.subscribe((songs) => {
      this.songs = songs;
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

  playSong(filePath: string, title: string) {
    this.playerService.setFilePath(filePath);
    this.playerService.setTitle(title);
  }

  onSongDeleted() {
    this.playerService.fetchSongs().subscribe();
  }
}

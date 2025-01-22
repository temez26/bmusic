import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../service/player.service';
import { CoverWsService } from '../../service/websocket/coverws.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../service/api.service';
import { MenuComponent } from './menu/menu.component';
import { Song } from '../../service/models/song-def.class';
import { PlayerStateService } from '../../service/player.state.service';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent implements OnInit, OnDestroy {
  songs: Song[] = [];
  coverImageSrcMap: { [key: number]: string } = {};

  private songsSubscription!: Subscription;

  constructor(
    private playerService: PlayerService,
    private coverWsService: CoverWsService,
    private apiService: ApiService,
    private stateService: PlayerStateService
  ) {}

  ngOnInit() {
    this.songsSubscription = this.stateService.songs$.subscribe((songs) => {
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
    album_cover_url: string,
    artist: string
  ) {
    this.apiService.incrementPlayCount(songId).subscribe({
      next: () => {
        this.playerService.setData(
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
    this.playerService.fetchSongs().subscribe();
  }
}

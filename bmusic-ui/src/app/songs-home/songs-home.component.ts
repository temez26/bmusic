import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../service/player.service';
import { CoverWsService } from '../service/coverws.service';
import { DeleteComponent } from '../delete/delete.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-songs',
  standalone: true,
  templateUrl: './songs-home.component.html',
  imports: [CommonModule, DeleteComponent],
  styleUrls: ['./songs-home.component.scss'],
})
export class SongsComponent implements OnInit, OnDestroy {
  songs: any[] = [];
  albums: any[] = [];
  coverImageSrcMap: { [key: number]: string } = {};

  private songsSubscription!: Subscription;

  constructor(
    private playerService: PlayerService,
    private coverWsService: CoverWsService
  ) {}

  ngOnInit() {
    this.songsSubscription = this.playerService.songs$.subscribe((songs) => {
      this.songs = songs;
      this.groupSongsByAlbum();
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

  private groupSongsByAlbum() {
    const albumMap: { [key: string]: any } = {};
    this.songs.forEach((song) => {
      if (!albumMap[song.album]) {
        albumMap[song.album] = { name: song.album, songs: [], randomSongs: [] };
      }
      albumMap[song.album].songs.push(song);
    });
    this.albums = Object.values(albumMap);
    this.albums.forEach((album) => {
      album.randomSongs = this.getRandomSongs(album.songs);
    });
  }

  private getRandomSongs(songs: any[]): any[] {
    return songs.sort(() => 0.5 - Math.random()).slice(0, 10);
  }
}

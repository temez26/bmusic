import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerStateService } from '../../../service/states/player.state.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Song } from '../../../service/models/song.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { PlayComponent } from '../../shared/play/play.component';
import { MenuComponent } from '../../songs/menu/menu.component';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, PlayComponent, MenuComponent],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss',
})
export class AlbumComponent implements OnInit, OnDestroy {
  private albumId: number = 0;
  public coverSrc: string = '';
  public songs: Song[] = [];
  private subscription!: Subscription;

  constructor(
    private stateService: PlayerStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.albumId = id ? +id : 0;
      this.getSongsByAlbum(this.albumId);
    });

    this.stateService.songs$.subscribe((songs) => {
      this.songs = songs.filter((song) => song.album_id === this.albumId);
      if (this.songs.length > 0) {
        this.coverSrc = `${environment.apiBaseUrl}${this.songs[0].album_cover_url}`;
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getSongsByAlbum(albumId: number): void {
    this.songs = this.stateService.getSongsByAlbumId(albumId);
    console.log(this.songs);
    if (this.songs.length > 0) {
      this.coverSrc = `${environment.apiBaseUrl}${this.songs[0].album_cover_url}`;
    }
  }
}

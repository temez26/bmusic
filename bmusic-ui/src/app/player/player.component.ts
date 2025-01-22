import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../service/player.service';
import { PlayerWsService } from '../service/websocket/playerws.service';
import { VolumeSliderComponent } from './volume-slider/volume-slider.component';
import { CoverWsService } from '../service/websocket/coverws.service';
import { PlayerModel } from '../service/models/player.model';
import { Subscription } from 'rxjs';
import { Song } from '../service/models/song-def.class';
import { VolumeIconComponent } from './volume-icon/volume-icon.component';
import { AudioService } from '../service/player/audio.service';
import { AlbumComponent } from './album/album.component';
import { PlayerStateService } from '../service/player.state.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    VolumeIconComponent,
    VolumeSliderComponent,
    AlbumComponent,
  ],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss', './progress.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressSlider', { static: true })
  progressSliderRef!: ElementRef<HTMLInputElement>;
  @ViewChild('volumeSlider', { static: true })
  volumeSliderRef!: ElementRef<HTMLInputElement>;

  player: PlayerModel = new PlayerModel();
  albumCoverSrc: string = '';
  songId: number = 0;

  private currentSongSubscription!: Subscription;

  constructor(
    private playerService: PlayerService,
    private playerWsService: PlayerWsService,
    private coverWsService: CoverWsService,
    private audioService: AudioService,
    private stateService: PlayerStateService
  ) {}

  ngOnInit() {
    this.currentSongSubscription = this.stateService.currentSong$.subscribe(
      (song: Song | null) => {
        if (song) {
          this.player.currentTitle = song.title;
          this.player.currentArtist = song.artist;
          this.coverWsService
            .getCovers(song.id, song.album_cover_url)
            .then((imageSrc) => {
              this.albumCoverSrc = imageSrc;
            })
            .catch((error) => {
              console.error('Error fetching cover:', error);
            });
        }
      }
    );

    this.stateService.filePath$.subscribe((filePath) => {
      if (filePath) {
        this.playerWsService.startWebSocket(filePath);
        this.audioRef.nativeElement.src = filePath;
      }
    });

    this.stateService.coverPath$.subscribe((coverPath) => {
      this.albumCoverSrc = coverPath ?? '';
      this.stateService.songId$.subscribe((songId) => {
        this.songId = songId ?? 0;
        this.coverWsService
          .getCovers(this.songId, this.albumCoverSrc)
          .then((imageSrc) => {
            this.albumCoverSrc = imageSrc;
          });
      });
    });

    this.stateService.title$.subscribe((title) => {
      this.player.currentTitle = title;
    });
    this.stateService.artistPath$.subscribe((artist) => {
      this.player.currentArtist = artist;
    });

    this.progressSliderRef.nativeElement.addEventListener(
      'input',
      this.seek.bind(this)
    );
    this.audioRef.nativeElement.addEventListener(
      'timeupdate',
      this.updateCurrentTime.bind(this)
    );
    this.audioRef.nativeElement.addEventListener(
      'ended',
      this.handleSongEnd.bind(this)
    );
    // check if music is playing
    this.stateService.isPlaying$.subscribe((isPlaying) => {
      this.player.isPlaying = isPlaying;
    });
    // sets the inital volume on startup
    this.onVolumeChange(this.player.volumePercentage);
  }

  ngOnDestroy() {
    if (this.currentSongSubscription) {
      this.currentSongSubscription.unsubscribe();
    }
  }

  nextSong() {
    if (this.player.isShuffle) {
      this.audioService.playRandomSong();
    } else {
      this.audioService.changeSong(1);
    }
    this.stateService.setIsPlaying(true);
  }

  previousSong() {
    this.audioService.changeSong(-1);
    this.stateService.setIsPlaying(true);
  }

  toggleShuffle() {
    this.player.isShuffle = !this.player.isShuffle;
    console.log('Shuffle toggled:', this.player.isShuffle);
    this.stateService.setShuffle(this.player.isShuffle);
  }

  toggleRepeat() {
    this.player.isRepeat = !this.player.isRepeat;
    console.log('Repeat toggled:', this.player.isRepeat);
    this.stateService.setRepeat(this.player.isRepeat);
  }

  togglePlayPause() {
    const audio = this.audioRef.nativeElement;
    if (audio.paused) {
      audio.play();
      this.stateService.setIsPlaying(true);
    } else {
      audio.pause();
      this.stateService.setIsPlaying(false);
    }
  }

  updateDuration(event: any) {
    this.audioService.updateDuration(event, this.player);
  }

  onVolumeChange(volumePercentage: number) {
    this.player.volumePercentage = volumePercentage;
    this.audioRef.nativeElement.volume = volumePercentage / 100;
  }
  //updates the time in progressbar
  updateCurrentTime(event: any) {
    this.audioService.updateCurrentTime(
      event,
      this.player,
      this.progressSliderRef
    );
  }
  // handle progress bar status
  seek(event: any) {
    this.audioService.seek(
      event,
      this.audioRef,
      this.player,
      this.progressSliderRef
    );
  }

  handleSongEnd() {
    this.audioService.handleSongEnd(
      this.audioRef,
      this.player,
      this.nextSong.bind(this)
    );
  }
}

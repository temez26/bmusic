import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerWsService } from '../service/websocket/playerws.service';
import { VolumeSliderComponent } from './volume-slider/volume-slider.component';
import { PlayerModel } from '../service/models/player.class';
import { VolumeIconComponent } from './volume-icon/volume-icon.component';
import { AudioService } from '../service/player/audio.service';
import { AlbumCoverComponent } from './album-cover/album-cover.component';
import { PlayerService } from '../service/player/player.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    VolumeIconComponent,
    VolumeSliderComponent,
    AlbumCoverComponent,
  ],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss', './progress.component.scss'],
})
export class PlayerComponent implements OnInit {
  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressSlider', { static: true })
  progressSliderRef!: ElementRef<HTMLInputElement>;
  @ViewChild('volumeSlider', { static: true })
  volumeSliderRef!: ElementRef<HTMLInputElement>;

  player: PlayerModel;

  constructor(
    private playerWsService: PlayerWsService,
    private audioService: AudioService,
    private playerService: PlayerService
  ) {
    this.player = this.playerService.player;
  }

  ngOnInit() {
    this.playerService.filePath$.subscribe((filePath) => {
      this.playerService.updateIsPlaying(false);
      if (filePath) {
        this.playerWsService.startWebSocket(filePath).then(() => {
          this.audioRef.nativeElement.currentTime =
            this.playerService.player.currentTime;
          if (this.player.isPlaying) {
            this.audioRef.nativeElement.play();
          }
        });
      }
    });

    // handles what to do when song ends
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

    // sets the initial volume on startup
    this.onVolumeChange(this.playerService.player.volumePercentage);
  }

  nextSong() {
    if (this.player.isShuffle) {
      this.audioService.playRandomSong();
    } else {
      this.audioService.changeSong(1);
    }
    this.playerService.updateIsPlaying(true);
  }

  previousSong() {
    this.audioService.changeSong(-1);
    this.playerService.updateIsPlaying(true);
  }

  toggleShuffle() {
    this.player.isShuffle = !this.player.isShuffle;
    this.playerService.updateIsShuffle(this.player.isShuffle);
  }

  toggleRepeat() {
    this.player.isRepeat = !this.player.isRepeat;
    this.playerService.updateIsRepeat(this.player.isRepeat);
  }

  togglePlayPause() {
    const audio = this.audioRef.nativeElement;
    if (audio.paused) {
      audio.play();
      this.playerService.updateIsPlaying(true);
    } else {
      audio.pause();
      this.playerService.updateIsPlaying(false);
    }
  }

  updateDuration(event: any) {
    this.audioService.updateDuration(event);
  }

  onVolumeChange(volumePercentage: number) {
    this.playerService.player.volumePercentage = volumePercentage;
    this.audioRef.nativeElement.volume = volumePercentage / 100;
    this.playerService.updateIsPlaying(this.playerService.player.isPlaying);
  }

  // Updates the time in progress bar
  updateCurrentTime(event: any) {
    this.audioService.updateCurrentTime(
      event.target as HTMLAudioElement,
      this.progressSliderRef.nativeElement
    );
    this.playerService.updateCurrentTime(
      this.audioRef.nativeElement.currentTime
    );
  }

  // Handle progress bar status
  seek(event: any) {
    this.audioService.seek(
      event.target.value,
      this.audioRef.nativeElement,
      this.progressSliderRef.nativeElement
    );
    this.playerService.updateCurrentTime(
      this.audioRef.nativeElement.currentTime
    );
  }

  handleSongEnd() {
    this.audioService.handleSongEnd(this.audioRef);
  }
}

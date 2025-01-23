import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerWsService } from '../service/websocket/playerws.service';
import { VolumeSliderComponent } from './volume-slider/volume-slider.component';
import { PlayerModel } from '../service/models/player.model';
import { VolumeIconComponent } from './volume-icon/volume-icon.component';
import { AudioService } from '../service/player/audio.service';
import { AlbumComponent } from './album/album.component';
import { PlayerStateService } from '../service/player.state.service';
import { environment } from '../../environments/environment';
import { PlayerService } from './player.service';

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
    private stateService: PlayerStateService,
    private playerService: PlayerService
  ) {
    this.player = this.playerService.player;
  }

  ngOnInit() {
    this.stateService.filePath$.subscribe((filePath) => {
      if (filePath) {
        this.playerWsService.startWebSocket(filePath);
        this.audioRef.nativeElement.src = filePath;
      }
    });

    this.stateService.coverPath$.subscribe((coverPath) => {
      this.player.currentAlbumCover = `${environment.apiBaseUrl}${coverPath}`;
    });

    this.stateService.title$.subscribe((title) => {
      this.player.currentTitle = title;
    });
    this.stateService.artistPath$.subscribe((artist) => {
      this.player.currentArtist = artist;
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
    // check if music is playing
    this.stateService.isPlaying$.subscribe((isPlaying) => {
      this.player.isPlaying = isPlaying;
    });
    // sets the inital volume on startup
    this.onVolumeChange(this.player.volumePercentage);
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

    this.stateService.setShuffle(this.player.isShuffle);
  }

  toggleRepeat() {
    this.player.isRepeat = !this.player.isRepeat;
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

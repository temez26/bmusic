import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlayerService } from '../service/player.service';
import { PlayerWsService } from '../service/playerws.service';
import { ProgressService } from '../service/progress.service';
import { PlayerModel } from '../service/models/player.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: [
    './player.component.scss',
    './progress.component.scss',
    './volume-slider.component.scss',
  ],
})
export class PlayerComponent implements OnInit {
  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressSlider', { static: true })
  progressSliderRef!: ElementRef<HTMLInputElement>;
  @ViewChild('volumeSlider', { static: true })
  volumeSliderRef!: ElementRef<HTMLInputElement>;

  player: PlayerModel = new PlayerModel();

  constructor(
    private playerService: PlayerService,
    private playerWsService: PlayerWsService,
    private progressService: ProgressService
  ) {}

  ngOnInit() {
    this.playerService.filePath$.subscribe((filePath) => {
      if (filePath) {
        this.playerWsService.startWebSocket(filePath);
        this.audioRef.nativeElement.src = filePath;
      }
    });
    this.playerService.title$.subscribe((title) => {
      this.player.currentTitle = title;
    });

    this.progressSliderRef.nativeElement.addEventListener(
      'input',
      this.seek.bind(this)
    );
    this.audioRef.nativeElement.addEventListener(
      'timeupdate',
      this.updateCurrentTime.bind(this)
    );

    // Set initial volume
    this.audioRef.nativeElement.volume = this.player.volumePercentage / 100;
    this.volumeSliderRef.nativeElement.value = String(
      this.player.volumePercentage
    );

    // Initialize volume slider styles
    this.initializeSlider(this.volumeSliderRef.nativeElement);
  }

  initializeSlider(slider: HTMLInputElement) {
    slider.style.setProperty('--value', slider.value);
    slider.style.setProperty('--min', slider.min === '' ? '0' : slider.min);
    slider.style.setProperty('--max', slider.max === '' ? '100' : slider.max);
    slider.addEventListener('input', () =>
      slider.style.setProperty('--value', slider.value)
    );
  }

  nextSong() {
    this.playerService.changeSong(1);
  }

  previousSong() {
    this.playerService.changeSong(-1);
  }

  toggleShuffle() {
    this.player.isShuffle = !this.player.isShuffle;
    console.log('Shuffle toggled:', this.player.isShuffle);
  }

  toggleRepeat() {
    this.player.isRepeat = !this.player.isRepeat;
    console.log('Repeat toggled:', this.player.isRepeat);
  }

  togglePlayPause() {
    const audio = this.audioRef.nativeElement;
    if (audio.paused) {
      audio.play();
      this.player.isPlaying = true;
    } else {
      audio.pause();
      this.player.isPlaying = false;
    }
  }

  changeVolume(event: any) {
    const volume = event.target.value / 100;
    this.audioRef.nativeElement.volume = volume;
    this.player.volumePercentage = event.target.value;
    this.initializeSlider(event.target);
  }

  updateDuration(event: any) {
    const audio = event.target;
    const { duration, formattedDuration } =
      this.progressService.updateDuration(audio);
    this.player.audioDuration = duration;
    this.player.duration = formattedDuration;
  }

  updateCurrentTime(event: any) {
    const audio = event.target;
    const { currentTime, formattedCurrentTime } =
      this.progressService.updateCurrentTime(audio);
    this.player.audioCurrentTime = currentTime;
    this.player.currentTime = formattedCurrentTime;
    this.updateProgress();
  }

  seek(event: any) {
    const seekTime = event.target.value;
    const { currentTime } = this.progressService.seek(
      this.audioRef.nativeElement,
      seekTime
    );
    this.player.audioCurrentTime = currentTime;
    this.updateProgress();
  }

  updateProgress() {
    this.progressService.updateProgress(
      this.progressSliderRef.nativeElement,
      this.audioRef.nativeElement
    );
  }
}

import { Injectable, ElementRef } from '@angular/core';
import { ProgressService } from './progress.service';
import { PlayerModel } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  constructor(private progressService: ProgressService) {}

  initializeSlider(slider: HTMLInputElement) {
    slider.style.setProperty('--value', slider.value);
    slider.style.setProperty('--min', slider.min === '' ? '0' : slider.min);
    slider.style.setProperty('--max', slider.max === '' ? '100' : slider.max);
    slider.addEventListener('input', () =>
      slider.style.setProperty('--value', slider.value)
    );
  }

  changeVolume(
    event: any,
    volumeSliderRef: ElementRef<HTMLInputElement>,
    player: PlayerModel
  ) {
    const volume = event.target.value / 100;
    const audio = volumeSliderRef.nativeElement.closest('audio');
    if (audio) {
      audio.volume = volume;
    }
    player.volumePercentage = event.target.value;
    this.initializeSlider(event.target);
  }

  updateDuration(event: any, player: PlayerModel) {
    const audio = event.target;
    const { duration, formattedDuration } =
      this.progressService.updateDuration(audio);
    player.audioDuration = duration;
    player.duration = formattedDuration;
  }

  updateCurrentTime(
    event: any,
    player: PlayerModel,
    progressSliderRef: ElementRef<HTMLInputElement>
  ) {
    const audio = event.target;
    const { currentTime, formattedCurrentTime } =
      this.progressService.updateCurrentTime(audio);
    player.audioCurrentTime = currentTime;
    player.currentTime = formattedCurrentTime;
    this.updateProgress(progressSliderRef, audio);
  }

  seek(
    event: any,
    audioRef: ElementRef<HTMLAudioElement>,
    player: PlayerModel,
    progressSliderRef: ElementRef<HTMLInputElement>
  ) {
    const seekTime = event.target.value;
    const { currentTime } = this.progressService.seek(
      audioRef.nativeElement,
      seekTime
    );
    player.audioCurrentTime = currentTime;
    this.updateProgress(progressSliderRef, audioRef.nativeElement);
  }

  updateProgress(
    sliderRef: ElementRef<HTMLInputElement>,
    audio: HTMLAudioElement
  ) {
    this.progressService.updateProgress(sliderRef.nativeElement, audio);
  }

  handleSongEnd(
    audioRef: ElementRef<HTMLAudioElement>,
    player: PlayerModel,
    nextSong: () => void
  ) {
    if (player.isRepeat) {
      audioRef.nativeElement.currentTime = 0;
      audioRef.nativeElement.play();
    } else {
      nextSong();
    }
  }
}

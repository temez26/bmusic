import { Injectable, ElementRef } from '@angular/core';
import { ProgressService } from './progress.service';
import { PlayerModel } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
// Service for managing audio playback and volume control
export class AudioService {
  constructor(private progressService: ProgressService) {}

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
    this.progressService.initializeSlider(event.target);
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
    this.progressService.updateProgress(progressSliderRef.nativeElement, audio);
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
    this.progressService.updateProgress(
      progressSliderRef.nativeElement,
      audioRef.nativeElement
    );
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

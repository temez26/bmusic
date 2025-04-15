import { Injectable } from '@angular/core';
import { ProgressService } from './progress.service';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class progressBarService {
  constructor(
    private progressService: ProgressService,
    private playerService: PlayerService
  ) {}
  // updates timer right side of the progressbar
  updateDuration(event: any) {
    const audio = event.target;
    const { duration, formattedDuration } =
      this.progressService.updateDuration(audio);
    this.playerService.updateAudioDuration(duration);
    this.playerService.updateFormattedLength(formattedDuration);
  }

  // updates time left side of the progressbar
  updateCurrentTime(
    audio: HTMLAudioElement,
    progressSlider: HTMLInputElement
  ): void {
    const { currentTime, formattedCurrentTime } =
      this.progressService.updateCurrentTime(audio);
    this.playerService.updateFormattedCurrentTime(formattedCurrentTime);
    this.playerService.updateCurrentTime(currentTime);
    this.progressService.updateProgress(progressSlider, audio);
  }

  //progress bar status
  seek(
    seekTime: number,
    audio: HTMLAudioElement,
    progressSlider: HTMLInputElement
  ): void {
    const { currentTime } = this.progressService.seek(audio, seekTime);
    this.playerService.updateCurrentTime(currentTime);
    this.progressService.updateProgress(progressSlider, audio);
  }
}

import { Injectable } from '@angular/core';
import { ProgressService, PlayerService } from '../../service';

@Injectable({ providedIn: 'root' })
export class ProgressBarService {
  constructor(
    private progress: ProgressService,
    private player: PlayerService
  ) {}

  // call from (loadedmetadata) on <audio>
  onDurationChange(event: Event): void {
    const audio = event.target as HTMLAudioElement;
    const { duration, formattedDuration } = this.progress.updateDuration(audio);
    this.sync({ duration, formattedDuration });
  }

  // call from (timeupdate) on <audio>
  onTimeUpdate(audio: HTMLAudioElement, slider: HTMLInputElement): void {
    const { currentTime, formattedCurrentTime } =
      this.progress.updateCurrentTime(audio);
    this.sync({ currentTime, formattedCurrentTime });
    this.progress.updateProgress(slider, audio);
  }

  // call when user drags the slider
  onSeek(
    seekTime: number,
    audio: HTMLAudioElement,
    slider: HTMLInputElement
  ): void {
    const { currentTime } = this.progress.seek(audio, seekTime);
    this.sync({ currentTime });
    this.progress.updateProgress(slider, audio);
  }

  /** consolidate all PlayerService updates in one place */
  private sync(opts: {
    duration?: number;
    formattedDuration?: string;
    currentTime?: number;
    formattedCurrentTime?: string;
  }): void {
    const { duration, formattedDuration, currentTime, formattedCurrentTime } =
      opts;
    if (duration != null) {
      this.player.updateAudioDuration(duration);
      if (formattedDuration) {
        this.player.updateFormattedLength(formattedDuration);
      }
    }
    if (currentTime != null) {
      this.player.updateCurrentTime(currentTime);
      if (formattedCurrentTime) {
        this.player.updateFormattedCurrentTime(formattedCurrentTime);
      }
    }
  }
}

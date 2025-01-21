import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  updateDuration(audio: HTMLAudioElement): {
    duration: number;
    formattedDuration: string;
  } {
    const duration = audio.duration;
    return { duration, formattedDuration: this.formatTime(duration) };
  }

  updateCurrentTime(audio: HTMLAudioElement): {
    currentTime: number;
    formattedCurrentTime: string;
  } {
    const currentTime = audio.currentTime;
    return { currentTime, formattedCurrentTime: this.formatTime(currentTime) };
  }

  seek(audio: HTMLAudioElement, seekTime: number): { currentTime: number } {
    audio.currentTime = seekTime;
    return { currentTime: seekTime };
  }

  updateProgress(slider: HTMLInputElement, audio: HTMLAudioElement) {
    const value = (audio.currentTime / audio.duration) * 100;
    slider.style.setProperty('--progress', `${value}%`);
    slider.value = String(audio.currentTime);
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

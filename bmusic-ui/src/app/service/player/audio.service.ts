import { Injectable, ElementRef } from '@angular/core';
import { ProgressService } from './progress.service';
import { PlayerModel } from '../models/player.class';
import { PlayerService } from './player.service';
import { SongsStateService } from '../states/songs.state.service';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
// Service for managing audio playback and volume control
export class AudioService {
  player: PlayerModel;
  constructor(
    private progressService: ProgressService,
    private stateService: SongsStateService,
    private playerState: PlayerService,
    private apiService: ApiService
  ) {
    this.player = this.playerState.player;
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
    this.progressService.initializeSlider(event.target);
  }
  // updates timer right side of the progressbar
  updateDuration(event: any) {
    const audio = event.target;
    const { duration, formattedDuration } =
      this.progressService.updateDuration(audio);
    this.playerState.updateAudioDuration(duration);
    this.playerState.updateFormattedLength(formattedDuration);
  }
  // updates time left side of the progressbar
  updateCurrentTime(
    audio: HTMLAudioElement,
    progressSlider: HTMLInputElement
  ): void {
    const { currentTime, formattedCurrentTime } =
      this.progressService.updateCurrentTime(audio);
    this.playerState.updateFormattedCurrentTime(formattedCurrentTime);
    this.playerState.updateCurrentTime(currentTime);
    this.progressService.updateProgress(progressSlider, audio);
  }
  //progress bar status
  seek(
    seekTime: number,
    audio: HTMLAudioElement,
    progressSlider: HTMLInputElement
  ): void {
    const { currentTime } = this.progressService.seek(audio, seekTime);
    this.playerState.updateCurrentTime(currentTime);
    this.progressService.updateProgress(progressSlider, audio);
  }

  handleSongEnd(audioRef: ElementRef<HTMLAudioElement>) {
    if (this.player.isRepeat) {
      audioRef.nativeElement.currentTime = 0;
      audioRef.nativeElement.play();
    }
    if (this.player.isShuffle) {
      this.playRandomSong();
    } else {
      this.changeSong(1);
    }
  }

  setData(songId: number): void {
    this.stateService.setCurrentSongById(songId);
    this.apiService.incrementPlayCount(songId).subscribe();
  }
  changeSong(offset: number): void {
    const currentSongId = this.player.currentSongId;

    if (currentSongId !== null) {
      const songs = this.stateService.getSongs();
      const currentSongIndex = songs.findIndex(
        (song) => song.id === currentSongId
      );

      if (currentSongId !== -1) {
        const newIndex =
          (currentSongIndex + offset + songs.length) % songs.length;
        const newSong = songs[newIndex];
        this.stateService.setCurrentSongById(newSong.id);
        this.apiService.incrementPlayCount(newSong.id).subscribe();
      } else {
        console.error('current song not found in the list');
      }
    } else {
      console.error('current song id is null');
    }
  }

  playRandomSong(): void {
    const songs = this.stateService.getSongs();
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    this.stateService.setCurrentSongById(randomSong.id);
    this.apiService.incrementPlayCount(randomSong.id).subscribe();
  }
}

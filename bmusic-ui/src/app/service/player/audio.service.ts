import { Injectable, ElementRef } from '@angular/core';
import {
  Song,
  SongsStateService,
  PlayerService,
  PlayerModel,
  ProgressService,
} from '../../service';

@Injectable({
  providedIn: 'root',
})
// Service for managing audio playback and volume control
export class AudioService {
  player: PlayerModel;
  songs!: Song[];
  constructor(
    private progressService: ProgressService,
    private stateService: SongsStateService,
    private playerService: PlayerService
  ) {
    this.player = this.playerService.player;
    this.stateService.songs$.subscribe((songs) => {
      this.songs = songs;
    });
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

  setData(songId: number): void {
    this.stateService.setCurrentSongById(songId);
  }

  changeSong(offset: number): void {
    const currentSongId = this.player.currentSongId;

    if (currentSongId === null) {
      console.error('Current song id is null');
      return;
    }

    const currentSongIndex = this.songs.findIndex(
      (song) => song.id === currentSongId
    );

    if (currentSongIndex === -1) {
      console.error('Current song not found in the list');
      return;
    }

    const songsCount = this.songs.length;
    const newIndex = (currentSongIndex + offset + songsCount) % songsCount;

    this.stateService.setCurrentSongById(this.songs[newIndex].id);
  }

  playRandomSong(): void {
    const songs = this.songs;
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    this.stateService.setCurrentSongById(randomSong.id);
  }
}

import { Injectable, ElementRef } from '@angular/core';
import { ProgressService } from './progress.service';
import { PlayerModel } from '../models/player.class';
import { PlayerService } from './player.service';
import { SongsStateService } from '../states/songs.state.service';
import { ApiService } from '../api.service';
import { PlaylistService } from '../states/playlist.service';

@Injectable({
  providedIn: 'root',
})
// Service for managing audio playback and volume control
export class AudioService {
  player: PlayerModel;
  constructor(
    private progressService: ProgressService,
    private stateService: SongsStateService,
    private playerService: PlayerService,
    private apiService: ApiService,
    private playlistService: PlaylistService
  ) {
    this.player = this.playerService.player;
  }

  private incrementPlayCount(songId: number): void {
    this.apiService.incrementPlayCount(songId).subscribe();
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

  handleSongEnd(audioRef: ElementRef<HTMLAudioElement>) {
    if (this.player.isRepeat) {
      audioRef.nativeElement.play();
      if (this.player.currentSongId !== null) {
        this.incrementPlayCount(this.player.currentSongId);
      }
    } else if (this.player.isShuffle) {
      this.playRandomSong();
    } else {
      this.changeSong(1);
    }
  }
  setData(songId: number): void {
    this.stateService.setCurrentSongById(songId);
    this.incrementPlayCount(songId);
  }

  changeSong(offset: number): void {
    const currentSongId = this.player.currentSongId;

    if (currentSongId !== null) {
      // Use playlist songs if available; otherwise use all songs.
      let songs = this.playlistService.getCurrentPlaylistSongs();
      if (!songs || songs.length === 0) {
        songs = this.stateService.getSongs();
      }
      const currentSongIndex = songs.findIndex(
        (song) => song.id === currentSongId
      );

      if (currentSongIndex !== -1) {
        const newIndex =
          (currentSongIndex + offset + songs.length) % songs.length;
        const newSong = songs[newIndex];
        this.stateService.setCurrentSongById(newSong.id);
        this.incrementPlayCount(newSong.id);
      } else {
        console.error('Current song not found in the list');
      }
    } else {
      console.error('Current song id is null');
    }
  }

  playRandomSong(): void {
    const songs = this.stateService.getSongs();
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    this.stateService.setCurrentSongById(randomSong.id);
    this.incrementPlayCount(randomSong.id);
  }
}

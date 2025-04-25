import { Injectable, ElementRef } from '@angular/core';
import {
  Song,
  PlaylistStateService,
  SongsStateService,
  PlayerService,
  PlayerModel,
  StreamService,
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
    private playerService: PlayerService,
    private playlistService: PlaylistStateService,
    private streamService: StreamService
  ) {
    this.player = this.playerService.player;
    this.stateService.songs$.subscribe((songs) => {
      this.songs = songs;
    });
  }

  private incrementPlayCount(songId: number): void {
    this.streamService.incrementPlayCount(songId).subscribe();
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
    this.incrementPlayCount(songId);
  }

  changeSong(offset: number): void {
    const currentSongId = this.player.currentSongId;

    if (currentSongId !== null) {
      // Use playlist songs if available; otherwise use all songs.
      this.playlistService.currentPlaylist$.subscribe((playlist) => {
        this.songs = playlist;
      });

      const currentSongIndex = this.songs.findIndex(
        (song) => song.id === currentSongId
      );

      if (currentSongIndex !== -1) {
        const newIndex =
          (currentSongIndex + offset + this.songs.length) % this.songs.length;
        const newSong = this.songs[newIndex];
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
    const songs = this.songs;
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    this.stateService.setCurrentSongById(randomSong.id);
    this.incrementPlayCount(randomSong.id);
  }
}

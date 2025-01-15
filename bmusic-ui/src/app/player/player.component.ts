import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlayerService } from '../service/player.service';
import { PlayerWsService } from '../service/playerws.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;

  currentTitle: string | null = null;
  currentAlbumCover: string | null = null;
  currentTime: string = '0:00';
  duration: string = '0:00';
  audioCurrentTime: number = 0;
  audioDuration: number = 0;
  isShuffle: boolean = false;
  isRepeat: boolean = false;
  isPlaying: boolean = false;
  volumePercentage: number = 100;

  constructor(
    private playerService: PlayerService,
    private playerWsService: PlayerWsService
  ) {}

  ngOnInit() {
    this.playerService.filePath$.subscribe((filePath) => {
      if (filePath) {
        this.playerWsService.startWebSocket(filePath);
        this.audioRef.nativeElement.src = filePath;
      }
    });
    this.playerService.title$.subscribe((title) => {
      this.currentTitle = title;
    });
  }

  nextSong() {
    this.playerService.changeSong(1);
  }

  previousSong() {
    this.playerService.changeSong(-1);
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    console.log('Shuffle toggled:', this.isShuffle);
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    console.log('Repeat toggled:', this.isRepeat);
  }

  togglePlayPause() {
    const audio = this.audioRef.nativeElement;
    if (audio.paused) {
      audio.play();
      this.isPlaying = true;
    } else {
      audio.pause();
      this.isPlaying = false;
    }
  }

  changeVolume(event: any) {
    const volume = event.target.value / 100;
    this.audioRef.nativeElement.volume = volume;
    this.volumePercentage = event.target.value;
    console.log('Volume changed:', volume);
  }

  updateDuration(event: any) {
    const audio = event.target;
    this.audioDuration = audio.duration;
    this.duration = this.formatTime(audio.duration);
  }

  updateCurrentTime(event: any) {
    const audio = event.target;
    this.audioCurrentTime = audio.currentTime;
    this.currentTime = this.formatTime(audio.currentTime);
  }

  seek(event: any) {
    const seekTime = event.target.value;
    this.audioRef.nativeElement.currentTime = seekTime;
    this.audioCurrentTime = seekTime;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

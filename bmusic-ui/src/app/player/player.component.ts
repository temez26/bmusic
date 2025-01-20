import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../service/player.service';
import { PlayerWsService } from '../service/playerws.service';
import { ProgressService } from '../service/progress.service';
import { CoverWsService } from '../service/coverws.service';
import { PlayerModel } from '../service/models/player.model';
import { Subscription } from 'rxjs';
import { Song } from '../service/models/song-def.class';
import { VolumeIconComponent } from './volume-icon/volume-icon.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, VolumeIconComponent],
  templateUrl: './player.component.html',
  styleUrls: [
    './player.component.scss',
    './progress.component.scss',
    './volume-slider.component.scss',
  ],
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressSlider', { static: true })
  progressSliderRef!: ElementRef<HTMLInputElement>;
  @ViewChild('volumeSlider', { static: true })
  volumeSliderRef!: ElementRef<HTMLInputElement>;

  player: PlayerModel = new PlayerModel();
  albumCoverSrc: string = '';
  songId: number = 0;

  private currentSongSubscription!: Subscription;

  constructor(
    private playerService: PlayerService,
    private playerWsService: PlayerWsService,
    private progressService: ProgressService,
    private coverWsService: CoverWsService
  ) {}

  ngOnInit() {
    this.currentSongSubscription = this.playerService.currentSong$.subscribe(
      (song: Song | null) => {
        if (song) {
          this.player.currentTitle = song.title;
          this.player.currentArtist = song.artist;
          this.coverWsService
            .getCovers(song.id, song.album_cover_url)
            .then((imageSrc) => {
              this.albumCoverSrc = imageSrc;
            })
            .catch((error) => {
              console.error('Error fetching cover:', error);
            });
        }
      }
    );

    this.playerService.filePath$.subscribe((filePath) => {
      if (filePath) {
        this.playerWsService.startWebSocket(filePath);
        this.audioRef.nativeElement.src = filePath;
      }
    });

    this.playerService.coverPath$.subscribe((coverPath) => {
      this.albumCoverSrc = coverPath ?? '';
      this.playerService.songId$.subscribe((songId) => {
        this.songId = songId ?? 0;
        this.coverWsService
          .getCovers(this.songId, this.albumCoverSrc)
          .then((imageSrc) => {
            this.albumCoverSrc = imageSrc;
          });
      });
    });

    this.playerService.title$.subscribe((title) => {
      this.player.currentTitle = title;
    });
    this.playerService.artistPath$.subscribe((artist) => {
      this.player.currentArtist = artist;
    });

    this.progressSliderRef.nativeElement.addEventListener(
      'input',
      this.seek.bind(this)
    );
    this.audioRef.nativeElement.addEventListener(
      'timeupdate',
      this.updateCurrentTime.bind(this)
    );
    this.audioRef.nativeElement.addEventListener(
      'ended',
      this.handleSongEnd.bind(this)
    );
    // check if music is playing
    this.playerService.isPlaying$.subscribe((isPlaying) => {
      this.player.isPlaying = isPlaying;
    });
    // Set initial volume
    this.audioRef.nativeElement.volume = this.player.volumePercentage / 100;
    this.volumeSliderRef.nativeElement.value = String(
      this.player.volumePercentage
    );

    // Initialize volume slider styles
    this.initializeSlider(this.volumeSliderRef.nativeElement);
  }

  ngOnDestroy() {
    if (this.currentSongSubscription) {
      this.currentSongSubscription.unsubscribe();
    }
  }

  initializeSlider(slider: HTMLInputElement) {
    slider.style.setProperty('--value', slider.value);
    slider.style.setProperty('--min', slider.min === '' ? '0' : slider.min);
    slider.style.setProperty('--max', slider.max === '' ? '100' : slider.max);
    slider.addEventListener('input', () =>
      slider.style.setProperty('--value', slider.value)
    );
  }

  nextSong() {
    if (this.player.isShuffle) {
      this.playerService.playRandomSong();
    } else {
      this.playerService.changeSong(1);
    }
    this.playerService.setIsPlaying(true);
  }

  previousSong() {
    this.playerService.changeSong(-1);
    this.playerService.setIsPlaying(true);
  }

  toggleShuffle() {
    this.player.isShuffle = !this.player.isShuffle;
    console.log('Shuffle toggled:', this.player.isShuffle);
    this.playerService.setShuffle(this.player.isShuffle);
  }

  toggleRepeat() {
    this.player.isRepeat = !this.player.isRepeat;
    console.log('Repeat toggled:', this.player.isRepeat);
    this.playerService.setRepeat(this.player.isRepeat);
  }

  togglePlayPause() {
    const audio = this.audioRef.nativeElement;
    if (audio.paused) {
      audio.play();
      this.playerService.setIsPlaying(true);
    } else {
      audio.pause();
      this.playerService.setIsPlaying(false);
    }
  }

  changeVolume(event: any) {
    const volume = event.target.value / 100;
    this.audioRef.nativeElement.volume = volume;
    this.player.volumePercentage = event.target.value;
    this.initializeSlider(event.target);
  }

  updateDuration(event: any) {
    const audio = event.target;
    const { duration, formattedDuration } =
      this.progressService.updateDuration(audio);
    this.player.audioDuration = duration;
    this.player.duration = formattedDuration;
  }

  updateCurrentTime(event: any) {
    const audio = event.target;
    const { currentTime, formattedCurrentTime } =
      this.progressService.updateCurrentTime(audio);
    this.player.audioCurrentTime = currentTime;
    this.player.currentTime = formattedCurrentTime;
    this.updateProgress();
  }

  seek(event: any) {
    const seekTime = event.target.value;
    const { currentTime } = this.progressService.seek(
      this.audioRef.nativeElement,
      seekTime
    );
    this.player.audioCurrentTime = currentTime;
    this.updateProgress();
  }

  updateProgress() {
    this.progressService.updateProgress(
      this.progressSliderRef.nativeElement,
      this.audioRef.nativeElement
    );
  }

  handleSongEnd() {
    if (this.player.isRepeat) {
      this.audioRef.nativeElement.currentTime = 0;
      this.audioRef.nativeElement.play();
    } else {
      this.nextSong();
    }
  }
}

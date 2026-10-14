import { Component, DestroyRef, ElementRef, OnInit, ViewChild, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { PlaybackService } from '@features/play-song';
import { PlayerStore, TrackRequest } from '@entities/player';
import { mediaUrl } from '@shared/api';
import { formatTime } from '@shared/lib';
import { NowPlayingComponent } from './now-playing.component';
import { VolumeIconComponent } from './volume-icon.component';
import { VolumeSliderComponent } from './volume-slider.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [NowPlayingComponent, VolumeIconComponent, VolumeSliderComponent],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss', './progress.scss'],
})
export class PlayerComponent implements OnInit {
  @ViewChild('audio', { static: true }) private audioRef!: ElementRef<HTMLAudioElement>;

  readonly player = inject(PlayerStore);
  private readonly playback = inject(PlaybackService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly track$ = toObservable(this.player.track);

  readonly elapsed = computed(() => formatTime(this.player.position()));
  readonly total = computed(() => formatTime(this.player.duration()));
  readonly progress = computed(() => {
    const duration = this.player.duration();
    return duration ? (this.player.position() / duration) * 100 : 0;
  });

  private get audio(): HTMLAudioElement {
    return this.audioRef.nativeElement;
  }

  ngOnInit(): void {
    this.audio.volume = this.player.volume() / 100;
    this.track$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((track) => track && this.loadTrack(track));
  }

  togglePlay(): void {
    if (!this.player.current()) return;
    if (this.audio.paused) {
      this.player.setPlaying(true);
      this.startAudio();
    } else {
      this.audio.pause();
      this.player.setPlaying(false);
    }
  }

  next(): void {
    this.playback.next();
  }

  previous(): void {
    this.playback.previous();
  }

  seek(seconds: number): void {
    this.audio.currentTime = seconds;
    this.player.setPosition(seconds);
  }

  setVolume(volume: number): void {
    this.audio.volume = volume / 100;
    this.player.setVolume(volume);
  }

  onTimeUpdate(): void {
    this.player.setPosition(this.audio.currentTime);
  }

  onMetadata(): void {
    this.player.setDuration(this.audio.duration);
  }

  onEnded(): void {
    this.playback.onTrackEnded();
  }

  private loadTrack({ song, startAt }: TrackRequest): void {
    this.audio.src = mediaUrl(song.file_path);
    if (startAt > 0) {
      this.audio.addEventListener('loadedmetadata', () => (this.audio.currentTime = startAt), {
        once: true,
      });
    }
    if (this.player.isPlaying()) this.startAudio();
  }

  private startAudio(): void {
    this.audio.play().catch((err: DOMException) => {
      // AbortError only means a newer track replaced this one.
      if (err.name !== 'AbortError') this.player.setPlaying(false);
    });
  }
}

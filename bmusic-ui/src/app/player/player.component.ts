import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, fromEvent, Subject, takeUntil, throttleTime } from 'rxjs';
import { VolumeSliderComponent } from './volume-slider/volume-slider.component';

import { VolumeIconComponent } from './volume-icon/volume-icon.component';

import { AlbumCoverComponent } from './album-cover/album-cover.component';
import {
  PlayerModel,
  AudioService,
  PlayerService,
  StreamService,
  ProgressBarService,
  PlayerSessionService,
  RemoteState,
} from '../service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    VolumeIconComponent,
    VolumeSliderComponent,
    AlbumCoverComponent,
    FormsModule,
  ],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss', './progress.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressSlider', { static: true })
  progressSliderRef!: ElementRef<HTMLInputElement>;
  @ViewChild('volumeSlider', { static: true })
  volumeSliderRef!: ElementRef<HTMLInputElement>;

  player: PlayerModel;
  private unsubscribe$ = new Subject<void>();
  devices: string[] = [];
  mainDeviceId: string = '';
  constructor(
    private audioService: AudioService,
    private playerService: PlayerService,
    private progressBar: ProgressBarService,
    private streamService: StreamService,
    public session: PlayerSessionService
  ) {
    this.player = this.playerService.player;
  }
  get isMain(): boolean {
    return this.session.deviceId === this.mainDeviceId;
  }
  ngOnInit() {
    this.session.playerState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state: RemoteState | null) => {
        if (!state) return;
        const audio = this.audioRef.nativeElement;
        const isRemote = state.deviceId !== this.session.deviceId;
        const isMain = this.isMain;

        // ── NEW: handle remote timer ticks ──
        if (isRemote && state.action === 'timeupdate') {
          this.playerService.updateCurrentTime(state.currentTime);
          this.progressBar.onSeek(
            state.currentTime,
            audio,
            this.progressSliderRef.nativeElement
          );
          return;
        }
        // 0️⃣ handle remote play/pause actions immediately
        if (state.action === 'play' || state.action === 'pause') {
          // Only main device controls audio element
          if (isMain) {
            if (state.action === 'play') {
              audio.play();
            } else {
              audio.pause();
            }
          }
          // All devices update UI state
          this.playerService.updateIsPlaying(state.action === 'play');
          return;
        }

        // skip pausing for remote volume events
        if (isRemote && state.action !== 'volume' && !audio.paused) {
          audio.pause();
        }

        // if volume‐only, just set volume & return
        if (state.action === 'volume') {
          this.playerService.player.volumePercentage = state.volumePercentage;
          this.volumeSliderRef.nativeElement.value = `${state.volumePercentage}`;
          // Always set audio element's volume on main device
          if (this.isMain) {
            audio.volume = state.volumePercentage / 100;
          }
          return;
        }

        // 4️⃣ update UI model
        this.playerService.updateIsShuffle(state.isShuffle);
        this.playerService.updateIsRepeat(state.isRepeat);
        this.playerService.updateCurrentTime(state.currentTime);
        // 4️⃣ update all UI model fields
        this.playerService.player.currentTitle = state.currentTitle;
        this.playerService.player.currentArtist = state.currentArtist;
        this.playerService.player.currentAlbumCover = state.currentAlbumCover;
        this.playerService.player.formattedLength = state.formattedLength;
        this.playerService.player.formattedCurrentTime =
          state.formattedCurrentTime;

        this.progressBar.onSeek(
          state.currentTime,
          audio,
          this.progressSliderRef.nativeElement
        );
        if (state.volumePercentage !== this.player.volumePercentage) {
          // update model
          this.playerService.player.volumePercentage = state.volumePercentage;
          // move the slider thumb
          this.volumeSliderRef.nativeElement.value = `${state.volumePercentage}`;
          // always apply to audio element so the “master” volume changes
          audio.volume = state.volumePercentage / 100;
        }
      });
    this.session.devices$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((list) => (this.devices = list));
    this.session.mainDeviceId$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((mainId) => {
        this.mainDeviceId = mainId;
        const audio = this.audioRef.nativeElement;

        if (this.isMain) {
          // If *we* are now main, load and play current state:
          this.streamService
            .initializeAudio(
              audio,
              this.player.filePath,
              this.player.currentTime
            )
            .then(() => {
              if (this.player.isPlaying) audio.play();
            });
          // re‐attach our local event listeners:
          audio.addEventListener(
            'timeupdate',
            this.updateCurrentTime.bind(this)
          );
          audio.addEventListener('ended', this.handleSongEnd.bind(this));
        } else {
          // If we lost “main” role, stop our audio element entirely:
          audio.pause();
          audio.removeAttribute('src');
        }
      });

    this.playerService
      .subscribeToFilePath()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((filePath) => {
        this.playerService.updateIsPlaying(false);
        this.audioRef.nativeElement.pause();

        if (filePath) {
          this.streamService
            .initializeAudio(
              this.audioRef.nativeElement,
              filePath,
              this.player.currentTime
            )
            .then(() => {
              if (this.player.isPlaying) {
                this.audioRef.nativeElement.play();
              }
            });
        }
      });
    this.playerService
      .subscribeToIsplaying()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isPlaying) => {
        this.player.isPlaying = isPlaying;
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

    // sets the initial volume on startup
    this.onVolumeChange(this.playerService.player.volumePercentage);

    this.session.updatePlayerState(this.playerService.player);
    const audioEl = this.audioRef.nativeElement;
    fromEvent(audioEl, 'timeupdate')
      .pipe(
        throttleTime(1000),
        filter(() => !audioEl.paused),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.playerService.updateCurrentTime(audioEl.currentTime);
        this.session.updatePlayerState(this.playerService.player, 'timeupdate');
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  onMainDeviceChange(id: string) {
    this.session.setMainDevice(id);
  }
  nextSong() {
    // pick the next track
    if (this.player.isShuffle) this.audioService.playRandomSong();
    else this.audioService.changeSong(1);

    // set playing & broadcast as 'play'
    this.playerService.updateIsPlaying(true);
    this.session.updatePlayerState(this.playerService.player, 'play');
  }

  previousSong() {
    this.audioService.changeSong(-1);
    this.playerService.updateIsPlaying(true);
    this.session.updatePlayerState(this.playerService.player, 'play');
  }

  toggleShuffle() {
    this.playerService.updateIsShuffle(!this.player.isShuffle);
    this.session.updatePlayerState(this.playerService.player);
  }

  toggleRepeat() {
    this.playerService.updateIsRepeat(!this.player.isRepeat);
    this.session.updatePlayerState(this.playerService.player);
  }

  togglePlayPause() {
    // 1. Determine the next state (opposite of current)
    const nextPlayingState = !this.player.isPlaying;

    // 2. Update the local model
    this.playerService.updateIsPlaying(nextPlayingState);

    // 3. Emit with correct action based on the NEW state
    this.session.updatePlayerState(
      this.playerService.player,
      nextPlayingState ? 'play' : 'pause'
    );

    // 4. Only control actual audio on main device
    if (this.isMain) {
      const audio = this.audioRef.nativeElement;
      nextPlayingState ? audio.play() : audio.pause();
    }
  }

  onVolumeChange(volumePercentage: number) {
    this.playerService.player.volumePercentage = volumePercentage;
    // always set local volume
    this.audioRef.nativeElement.volume = volumePercentage / 100;
    // broadcast as a 'volume' action
    this.session.updatePlayerState(this.playerService.player, 'volume');
  }
  updateDuration(event: any) {
    this.progressBar.onDurationChange(event);
    this.session.updatePlayerState(this.playerService.player);
  }

  // Updates the time in progress bar
  updateCurrentTime(event: any) {
    this.progressBar.onTimeUpdate(
      event.target as HTMLAudioElement,
      this.progressSliderRef.nativeElement
    );
    this.playerService.updateCurrentTime(
      this.audioRef.nativeElement.currentTime
    );
  }

  // Handle progress bar status
  seek(event: any) {
    this.progressBar.onSeek(
      event.target.value,
      this.audioRef.nativeElement,
      this.progressSliderRef.nativeElement
    );
    this.playerService.updateCurrentTime(
      this.audioRef.nativeElement.currentTime
    );
  }

  handleSongEnd() {
    this.audioService.handleSongEnd(this.audioRef);
    this.session.updatePlayerState(this.playerService.player);
  }
}

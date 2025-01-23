// filepath: /c:/Users/temek/Documents/GitHub/bmusic/bmusic-ui/src/app/player/volume-slider/volume-slider.component.ts
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
} from '@angular/core';
import { AudioService } from '../../service/player/audio.service';
import { ProgressService } from '../../service/player/progress.service';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-volume-slider',
  standalone: true,
  imports: [],
  templateUrl: './volume-slider.component.html',
  styleUrls: ['./volume-slider.component.scss'],
})
export class VolumeSliderComponent implements OnInit {
  @ViewChild('volumeSlider', { static: true })
  volumeSliderRef!: ElementRef<HTMLInputElement>;
  @Output() volumeChange = new EventEmitter<number>();
  volumePercentage: number = 0;

  constructor(
    private audioService: AudioService,
    private progressService: ProgressService,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.progressService.initializeSlider(this.volumeSliderRef.nativeElement);
    this.volumeSliderRef.nativeElement.value = String(
      this.playerService.player.volumePercentage
    );
    this.volumePercentage = this.playerService.player.volumePercentage;
  }

  changeVolume(event: any): void {
    const newVolume = Number(event.target.value);
    this.playerService.player.volumePercentage = newVolume;
    this.volumeChange.emit(newVolume);
  }
}

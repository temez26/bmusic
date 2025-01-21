import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import { PlayerModel } from '../../service/models/player.model';
import { AudioService } from '../../service/audio.service';

@Component({
  selector: 'app-volume-slider',
  standalone: true,
  imports: [],
  templateUrl: './volume-slider.component.html',
  styleUrl: './volume-slider.component.scss',
})
export class VolumeSliderComponent {
  @ViewChild('volumeSlider', { static: true })
  volumeSliderRef!: ElementRef<HTMLInputElement>;
  @Output() volumeChange = new EventEmitter<number>();

  player: PlayerModel = new PlayerModel();

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.audioService.initializeSlider(this.volumeSliderRef.nativeElement);
    this.volumeSliderRef.nativeElement.value = String(
      this.player.volumePercentage
    );
  }

  changeVolume(event: any) {
    this.audioService.changeVolume(event, this.volumeSliderRef, this.player);

    this.volumeChange.emit(this.player.volumePercentage);
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerModel } from '../../service/models/player.model';
import { AudioService } from '../../service/audio.service';

@Component({
  selector: 'app-volume-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volume-icon.component.html',
  styleUrl: './volume-icon.component.scss',
})
export class VolumeIconComponent {
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

import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
} from '@angular/core';
import { ProgressService } from '../../service/player/progress.service';
import { PlayerService } from '../../service/player/player.service';
import { PlayerModel } from '../../service/models/player.class';

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

  player: PlayerModel;

  constructor(
    private progressService: ProgressService,
    private playerService: PlayerService
  ) {
    this.player = this.playerService.player;
  }

  ngOnInit() {
    this.progressService.initializeSlider(this.volumeSliderRef.nativeElement);
    this.volumeSliderRef.nativeElement.value = String(
      this.player.volumePercentage
    );
  }

  changeVolume(event: any): void {
    const newVolume = Number(event.target.value);
    this.player.volumePercentage = newVolume;
    this.volumeChange.emit(newVolume);
  }
}

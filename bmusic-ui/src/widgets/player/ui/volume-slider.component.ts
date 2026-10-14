import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-volume-slider',
  standalone: true,
  templateUrl: './volume-slider.component.html',
  styleUrl: './volume-slider.component.scss',
})
export class VolumeSliderComponent {
  @Input() volume = 50;
  @Output() volumeChange = new EventEmitter<number>();
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-volume-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volume-icon.component.html',
  styleUrl: './volume-icon.component.scss',
})
export class VolumeIconComponent {
  @Input() volumePercentage!: number;
  @Output() volumeChange = new EventEmitter<number>();

  changeVolume(event: any) {
    const volume = event.target.value;
    this.volumeChange.emit(volume);
  }
}

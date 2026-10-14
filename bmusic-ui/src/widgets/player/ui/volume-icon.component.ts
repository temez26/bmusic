import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-volume-icon',
  standalone: true,
  templateUrl: './volume-icon.component.html',
  styleUrl: './volume-icon.component.scss',
})
export class VolumeIconComponent {
  @Input() volumePercentage = 0;
}

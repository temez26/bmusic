import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-volume-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volume-icon.component.html',
  styleUrls: ['./volume-icon.component.scss'],
})
export class VolumeIconComponent {
  @Input() volumePercentage: number = 0;
}

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ProgressService } from '../../service'; // rename if needed

@Component({
  selector: 'app-volume-slider',
  standalone: true,
  templateUrl: './volume-slider.component.html',
  styleUrls: ['./volume-slider.component.scss'],
})
export class VolumeSliderComponent implements AfterViewInit, OnChanges {
  @ViewChild('volumeSlider', { static: true })
  volumeSliderRef!: ElementRef<HTMLInputElement>;

  @Input() volumePercentage = 50;
  @Output() volumeChange = new EventEmitter<number>();

  constructor(private progressService: ProgressService) {}

  ngAfterViewInit() {
    // initial thumb fill
    this.updateTrackFill();
  }

  ngOnChanges(changes: SimpleChanges) {
    const volChange = changes['volumePercentage'];
    if (volChange && !volChange.firstChange) {
      // push the new value into the native <input>
      this.volumeSliderRef.nativeElement.value = String(this.volumePercentage);
      this.updateTrackFill();
    }
  }
  changeVolume(e: Event) {
    const newVol = Number((e.target as HTMLInputElement).value);
    this.volumeChange.emit(newVol);
  }

  private updateTrackFill() {
    // whatever your ProgressService does to paint the track
    this.progressService.initializeSlider(this.volumeSliderRef.nativeElement);
  }
}

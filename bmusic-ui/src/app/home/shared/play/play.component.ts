import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../service/player/audio.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  @Input() songId: number = 0;
  @Input() title: string = '';
  @Input() img: string = '';
  @Input() customCover: string = '';
  @Input() customTitle: string = '';
  @Input() customColumn: string = '';

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    this.img = `${environment.apiBaseUrl}${this.img}`;
  }

  playSong(songId: number) {
    this.audioService.setData(songId);
  }
}

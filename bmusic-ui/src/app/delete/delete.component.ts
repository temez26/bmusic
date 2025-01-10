import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../service/player.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
  @Input() songId!: number;
  @Output() songDeleted = new EventEmitter<void>();

  constructor(private playerService: PlayerService) {}

  deleteSong() {
    this.playerService.deleteSong(this.songId).subscribe(
      () => {
        console.log('Song deleted successfully');
        this.songDeleted.emit();
      },
      (error) => {
        console.error('Error deleting song', error);
      }
    );
  }
}

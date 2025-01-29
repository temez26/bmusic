import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../service/api.service';

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

  constructor(private apiService: ApiService) {}

  deleteSong() {
    this.apiService.deleteSong(this.songId).subscribe(
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

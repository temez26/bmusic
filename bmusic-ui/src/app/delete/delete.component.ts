import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
  @Input() songId!: number;

  constructor(private http: HttpClient) {}

  deleteSong() {
    const url = `http://${window.location.hostname}:4000/delete`;
    this.http.delete(url, { body: { id: this.songId } }).subscribe(
      (response) => {
        console.log('Song deleted successfully', response);
      },
      (error) => {
        console.error('Error deleting song', error);
      }
    );
  }
}

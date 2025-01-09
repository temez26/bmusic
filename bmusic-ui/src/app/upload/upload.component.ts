import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit {
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.selectedFile = target.files[0];
      }
    });
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http
        .post(`http://${window.location.hostname}:4000/upload`, formData)
        .subscribe({
          next: (response) => {
            console.log('File uploaded successfully', response);
          },
          error: (error) => {
            console.error('Error uploading file:', error);
          },
          complete: () => {
            console.log('Upload request completed');
          },
        });
    } else {
      console.error('No file selected');
    }
  }
}

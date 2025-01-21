import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../service/player.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  selectedFiles: File[] = [];
  fileCount: number = 0;
  successMessage: string = '';

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.initializeFileInput();
  }

  initializeFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.addEventListener('change', this.handleFileInputChange.bind(this));
  }

  handleFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFiles = Array.from(target.files);
      this.fileCount = target.files.length;
    } else {
      this.fileCount = 0;
    }
  }

  uploadFiles() {
    if (this.selectedFiles.length > 0) {
      this.playerService.uploadFiles(this.selectedFiles).subscribe({
        next: (response) => {
          console.log('Files uploaded successfully', response);
          this.selectedFiles = [];
          this.fileCount = 0;
          this.successMessage = 'Files uploaded successfully!';
        },
        error: (error) => {
          console.error('Error uploading files:', error);
          this.successMessage = 'Error uploading files. Please try again.';
        },
        complete: () => {
          console.log('Upload request completed');
        },
      });
    } else {
      console.error('No files selected');
      this.successMessage = 'No files selected. Please choose files to upload.';
    }
  }
}

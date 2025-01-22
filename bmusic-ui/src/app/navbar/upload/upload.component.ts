import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { PlayerStateService } from '../../service/player.state.service';

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

  constructor(
    private apiService: ApiService,
    private stateService: PlayerStateService
  ) {}

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
      this.apiService.uploadFiles(this.selectedFiles).subscribe({
        next: () => {
          this.selectedFiles = [];
          this.fileCount = 0;
          this.successMessage = 'Files uploaded successfully!';
        },
        error: (error) => {
          console.error('Error uploading files:', error);
        },
      });
    }
  }
}

import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { ApiUploadService } from '../../service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  selectedFiles: File[] = [];
  fileCount: number = 0;
  uploadProgress: number = 0;
  successMessage: string = '';

  constructor(
    private cd: ChangeDetectorRef,
    private uploadService: ApiUploadService
  ) {}

  handleFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFiles = this.selectedFiles.concat(Array.from(target.files));
      this.fileCount = this.selectedFiles.length;
    } else {
      this.fileCount = 0;
    }
  }

  uploadFiles() {
    if (this.selectedFiles.length > 0) {
      this.uploadService.uploadFiles(this.selectedFiles).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total
            );
            this.cd.markForCheck();
          } else if (event.type === HttpEventType.Response) {
            this.selectedFiles = [];
            this.fileCount = 0;
            this.successMessage = 'Files uploaded successfully!';
            this.uploadProgress = 0;
            this.cd.markForCheck();
          }
        },
        error: (error) => {
          console.error('Error uploading files:', error);
          this.uploadProgress = 0;
        },
      });
    }
  }
}

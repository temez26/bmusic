import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { HttpEventType } from '@angular/common/http';
import { AlbumStateService } from '../../service/states/album.state.service';
import { SongsStateService } from '../../service/states/songs.state.service';

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
  uploadProgress: number = 0;
  successMessage: string = '';

  constructor(
    private api: ApiService,
    private albumState: AlbumStateService,
    private songsState: SongsStateService
  ) {}

  ngOnInit() {
    this.initializeFileInput();
  }

  initializeFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const directoryInput = document.getElementById(
      'directoryInput'
    ) as HTMLInputElement;
    fileInput.addEventListener('change', this.handleFileInputChange.bind(this));
    directoryInput.addEventListener(
      'change',
      this.handleFileInputChange.bind(this)
    );
  }

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
      this.api.uploadFiles(this.selectedFiles).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event.type === HttpEventType.Response) {
            this.selectedFiles = [];
            this.fileCount = 0;
            this.successMessage = 'Files uploaded successfully!';
            this.uploadProgress = 0;

            // Fetch updated albums and songs
            this.api.fetchAlbums().subscribe((albums) => {
              this.albumState.setAlbums(albums);
            });
            this.api.fetchSongs().subscribe((songs) => {
              this.songsState.setSongs(songs);
            });
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

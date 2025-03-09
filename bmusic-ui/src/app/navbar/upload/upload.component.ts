import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { HttpEventType } from '@angular/common/http';
import { AlbumStateService } from '../../service/states/album.state.service';
import { SongsStateService } from '../../service/states/songs.state.service';
import { ArtistStateService } from '../../service/states/artist.state.service';

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
    private songsState: SongsStateService,
    private artistState: ArtistStateService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // No need to manually attach listeners; Angular handles (change) events.
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
            this.cd.markForCheck();
          } else if (event.type === HttpEventType.Response) {
            this.selectedFiles = [];
            this.fileCount = 0;
            this.successMessage = 'Files uploaded successfully!';
            this.uploadProgress = 0;
            this.cd.markForCheck();

            // Fetch updated albums, songs, and artists
            this.api.fetchAlbums().subscribe((albums) => {
              this.albumState.setAlbums(albums);
            });
            this.api.fetchSongs().subscribe((songs) => {
              this.songsState.setSongs(songs);
            });
            this.api.fetchArtists().subscribe((artists) => {
              this.artistState.setArtists(artists);
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

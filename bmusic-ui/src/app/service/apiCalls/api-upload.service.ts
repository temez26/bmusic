import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, throwError, Observable, tap } from 'rxjs';
import {
  ApiService,
  SongsStateService,
  AlbumStateService,
  ArtistStateService,
} from '../../service';

@Injectable({
  providedIn: 'root',
})
export class ApiUploadService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
    private albumState: AlbumStateService,
    private songsState: SongsStateService,
    private artistState: ArtistStateService
  ) {}

  uploadFiles(files: File[]): Observable<HttpEvent<any>> {
    const url = `${this.api.baseUrl}upload`;
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.http
      .post(url, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.Response) {
            // On successful upload, refresh albums, songs, and artists directly
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
        }),
        catchError((error) => {
          console.error('Error uploading files:', error);
          return throwError(() => error);
        })
      );
  }
}

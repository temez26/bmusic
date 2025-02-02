import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Song } from './models/song.interface';
import { Albums } from './models/album.interface';
import { Artists } from './models/artist.interface';
import { ArtistStateService } from './states/artist.state.service';
import { SongsStateService } from './states/songs.state.service';
import { AlbumStateService } from './states/album.state.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private songService: SongsStateService,
    private albumService: AlbumStateService,
    private artistService: ArtistStateService
  ) {}

  incrementPlayCount(songId: number) {
    const url = `${this.baseUrl}increment`;
    return this.http.post<{ playCount: number }>(url, { id: songId }).pipe(
      tap((response) => {
        const updatedPlayCount = response.playCount;
        const song = this.songService.getSongs().find((s) => s.id === songId);

        if (song) {
          this.songService.updateSong({
            ...song,
            play_count: updatedPlayCount,
          });
        }
      }),
      catchError((error) => {
        console.error('Error incrementing play count:', error);
        return throwError(() => error);
      })
    );
  }
  fetchSongs() {
    const url = `${this.baseUrl}songs`;
    return this.http.get<Song[]>(url).pipe(
      tap((fetchedSongs: Song[]) => {
        this.songService.setSongs(fetchedSongs);
      }),
      catchError((error) => {
        console.error('Error fetching songs:', error);
        return throwError(() => error);
      })
    );
  }
  fetchArtists() {
    const url = `${this.baseUrl}artists`;
    return this.http.get<Artists[]>(url).pipe(
      tap((fetchedArtists: Artists[]) => {
        this.artistService.setArtists(fetchedArtists);
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }
  fetchAlbums() {
    const url = `${this.baseUrl}albums`;
    return this.http.get<Albums[]>(url).pipe(
      tap((fetchedAlbums: Albums[]) => {
        this.albumService.setAlbums(fetchedAlbums);
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }

  deleteSong(songId: number) {
    const url = `${this.baseUrl}delete`;
    return this.http.delete<Song[]>(url, { body: { id: songId } }).pipe(
      tap((updatedSongs: Song[]) => {
        this.songService.setSongs(updatedSongs);
      }),
      catchError((error) => {
        console.error('Error deleting song:', error);
        return throwError(() => error);
      })
    );
  }

  uploadFiles(files: File[]) {
    const url = `${this.baseUrl}upload`;
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.http
      .post(url, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError((error) => {
          console.error('Error uploading files:', error);
          return throwError(() => error);
        })
      );
  }

  initializeAudio(
    audioElement: HTMLAudioElement,
    filePath: string,
    startTime: number = 0
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      audioElement.src = environment.apiBaseUrl + filePath;
      audioElement.load();
      audioElement.oncanplaythrough = () => {
        // Remove handler to avoid multiple calls when setting currentTime
        audioElement.oncanplaythrough = null;
        if (startTime > 0) {
          audioElement.currentTime = startTime;
        }
        resolve();
      };
      audioElement.onerror = (error) => reject(error);
    });
  }
}

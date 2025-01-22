import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UploadResponse } from './models/song-def.class';
import { tap } from 'rxjs/operators';
import { PlayerStateService } from './player.state.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(
    private apiService: ApiService,
    private stateService: PlayerStateService
  ) {}

  fetchSongs(): Observable<any> {
    return this.apiService
      .fetchSongs()
      .pipe(tap((songs) => this.stateService['songsSubject'].next(songs)));
  }

  deleteSong(songId: number): Observable<any> {
    return this.apiService
      .deleteSong(songId)
      .pipe(tap((songs) => this.stateService['songsSubject'].next(songs)));
  }

  uploadFiles(files: File[]): Observable<UploadResponse> {
    return this.apiService.uploadFiles(files).pipe(
      tap((response) => {
        if (response && response.songs) {
          this.stateService['songsSubject'].next(response.songs);
        }
      })
    );
  }
}

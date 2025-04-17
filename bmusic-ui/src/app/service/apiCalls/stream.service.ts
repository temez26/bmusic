import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, take, catchError, tap, map } from 'rxjs';
import { ApiService, SongsStateService } from '../../service';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  constructor(
    private http: HttpClient,
    private songService: SongsStateService,
    private api: ApiService
  ) {}

  incrementPlayCount(songId: number) {
    const url = `${this.api.baseUrl}increment`;
    return this.http.post<{ playCount: number }>(url, { id: songId }).pipe(
      tap((response) => {
        // Use the reactive stream to get the current songs
        this.songService.songs$
          .pipe(
            take(1),
            map((songs) =>
              songs.map((song) =>
                song.id === songId
                  ? { ...song, play_count: response.playCount }
                  : song
              )
            )
          )
          .subscribe((updatedSongs) => {
            // Update the entire songs list with the updated data
            this.songService.setSongs(updatedSongs);
          });
      }),
      catchError((error) => {
        console.error('Error incrementing play count:', error);
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
      audioElement.src = this.api.baseUrl + filePath;
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

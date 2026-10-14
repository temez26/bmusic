import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '@shared/api';
import type { Song } from '@entities/song';
import { Playlist } from '../model/playlist';

@Injectable({ providedIn: 'root' })
export class PlaylistApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(apiUrl('playlists'));
  }

  get(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(apiUrl(`playlists/${id}`));
  }

  create(name: string, description: string): Observable<Playlist> {
    return this.http.post<Playlist>(apiUrl('playlists'), { name, description });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(apiUrl(`playlists/${id}`));
  }

  getSongs(id: number): Observable<Song[]> {
    return this.http.get<Song[]>(apiUrl(`playlists/${id}/songs`));
  }

  addSong(id: number, songId: number): Observable<void> {
    return this.http.post<void>(apiUrl(`playlists/${id}/songs`), { songId });
  }

  removeSong(id: number, songId: number): Observable<void> {
    return this.http.delete<void>(apiUrl(`playlists/${id}/songs/${songId}`));
  }

  /** Ids of the playlists that contain the song. */
  getIdsContainingSong(songId: number): Observable<number[]> {
    return this.http.get<number[]>(apiUrl(`songs/${songId}/playlists`));
  }
}

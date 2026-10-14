import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '@shared/api';
import { Song } from '../model/song';

@Injectable({ providedIn: 'root' })
export class SongApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Song[]> {
    return this.http.get<Song[]>(apiUrl('songs'));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(apiUrl(`songs/${id}`));
  }

  recordPlay(id: number): Observable<{ playCount: number }> {
    return this.http.post<{ playCount: number }>(apiUrl(`songs/${id}/play`), {});
  }
}

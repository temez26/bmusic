import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '@shared/api';
import { Artist } from '../model/artist';

@Injectable({ providedIn: 'root' })
export class ArtistApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Artist[]> {
    return this.http.get<Artist[]>(apiUrl('artists'));
  }
}

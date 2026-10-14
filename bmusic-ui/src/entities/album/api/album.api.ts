import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '@shared/api';
import { Album } from '../model/album';

@Injectable({ providedIn: 'root' })
export class AlbumApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Album[]> {
    return this.http.get<Album[]>(apiUrl('albums'));
  }
}

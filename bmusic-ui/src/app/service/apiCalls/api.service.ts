import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  environment,
  SongsStateService,
  AlbumStateService,
  ArtistStateService,
  Artists,
  Albums,
  Song,
} from '../../service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public baseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private songService: SongsStateService,
    private albumService: AlbumStateService,
    private artistService: ArtistStateService
  ) {}

  fetchSongs() {
    const url = `${this.baseUrl}songs`;
    return this.http.get<Song[]>(url).pipe(
      tap((fetchedSongs: Song[]) => {
        this.songService.setSongs(fetchedSongs);
      }),
      catchError((error) => {
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
        return throwError(() => error);
      })
    );
  }
}

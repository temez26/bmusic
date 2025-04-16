import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Albums, CurrentAlbum } from '../models/album.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlbumStateService {
  private albumsSubject = new BehaviorSubject<Albums[]>([]);
  public albums$ = this.albumsSubject.asObservable();

  private currentAlbumSubject = new BehaviorSubject<CurrentAlbum | null>(null);
  public currentAlbum$ = this.currentAlbumSubject.asObservable();

  setAlbums(albums: Albums[]) {
    this.albumsSubject.next([...albums]);
  }
  setAlbum(album: Albums) {
    const currentAlbums = this.albumsSubject.getValue();
    this.albumsSubject.next([...currentAlbums, album]);
  }
  setCurrentAlbum(albumId: number) {
    const currentAlbums = this.albumsSubject.getValue();
    const currentAlbum = currentAlbums.find((album) => album.id === albumId);
    if (currentAlbum) {
      this.currentAlbumSubject.next({
        ...currentAlbum,
        current_album_id: albumId,
      });
    }
  }

  getAlbumCover(albumId: number): string {
    const currentAlbums = this.albumsSubject.getValue();
    const currentAlbum = currentAlbums.find((album) => album.id === albumId);
    return currentAlbum
      ? environment.apiBaseUrl + currentAlbum.cover_image_url
      : '';
  }
}

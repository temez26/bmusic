import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Album } from '../models/album.interface';

@Injectable({
  providedIn: 'root',
})
export class AlbumStateService {
  private albumSubject = new BehaviorSubject<Album[]>([]);
  public albums$: Observable<Album[]> = this.albumSubject.asObservable();

  setAlbums(albums: Album[]) {
    this.albumSubject.next([...albums]);
  }
  getAlbums(): Album[] {
    return this.albumSubject.getValue();
  }
}

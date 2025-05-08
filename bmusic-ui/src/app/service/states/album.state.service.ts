import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Albums } from '../../service';

@Injectable({
  providedIn: 'root',
})
export class AlbumStateService {
  private albumsSubject = new BehaviorSubject<Albums[]>([]);
  public albums$ = this.albumsSubject.asObservable();

  setAlbums(albums: Albums[]) {
    this.albumsSubject.next([...albums]);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Artists, Albums } from '..';

@Injectable({
  providedIn: 'root',
})
export class sharedStatesService {
  private artistSubject = new BehaviorSubject<Artists[]>([]);
  private albumsSubject = new BehaviorSubject<Albums[]>([]);

  public artists$ = this.artistSubject.asObservable();
  public albums$ = this.albumsSubject.asObservable();

  setArtists(artists: Artists[]) {
    this.artistSubject.next([...artists]);
  }

  setAlbums(albums: Albums[]) {
    this.albumsSubject.next([...albums]);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Artist } from '../models/artist.interface';

@Injectable({
  providedIn: 'root',
})
export class ArtistStateService {
  private artistSubject = new BehaviorSubject<Artist[]>([]);
  public artists$: Observable<Artist[]> = this.artistSubject.asObservable();

  setArtists(artists: Artist[]) {
    this.artistSubject.next([...artists]);
  }
  getArtists(): Artist[] {
    return this.artistSubject.getValue();
  }
}

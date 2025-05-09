import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Artists } from '../../service';

@Injectable({
  providedIn: 'root',
})
export class ArtistStateService {
  private artistSubject = new BehaviorSubject<Artists[]>([]);
  public artists$ = this.artistSubject.asObservable();

  setArtists(artists: Artists[]) {
    this.artistSubject.next([...artists]);
  }
}

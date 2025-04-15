import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Artists, CurrentArtist } from '../models/artist.interface';

@Injectable({
  providedIn: 'root',
})
export class ArtistStateService {
  private artistSubject = new BehaviorSubject<Artists[]>([]);
  public artists$: Observable<Artists[]> = this.artistSubject.asObservable();

  private currentArtistSubject = new BehaviorSubject<CurrentArtist | null>(
    null
  );
  public artist$: Observable<CurrentArtist | null> =
    this.currentArtistSubject.asObservable();

  setArtists(artists: Artists[]) {
    this.artistSubject.next([...artists]);
  }
  getArtists(): Artists[] {
    return this.artistSubject.getValue();
  }
  setCurrentArtist(artistId: number) {
    const currentArtists = this.artistSubject.getValue();
    const currentArtist = currentArtists.find(
      (artist) => artist.id === artistId
    );
    if (currentArtist) {
      this.currentArtistSubject.next({
        ...currentArtist,
      });
    }
  }

  getCurrentArtist() {
    return this.currentArtistSubject.getValue();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
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

  constructor(private http: HttpClient) {}

  setArtists(artists: Artists[]) {
    this.artistSubject.next([...artists]);
  }

  setCurrentArtist(artistId: number, currentArtistImg: string = '') {
    const currentArtists = this.artistSubject.getValue();
    const currentArtist = currentArtists.find(
      (artist) => artist.id === artistId
    );
    if (currentArtist) {
      this.currentArtistSubject.next({
        ...currentArtist,
        current_artist_id: artistId,
        artworkUrl100: currentArtistImg,
      });
    }
  }

  getArtists(): Artists[] {
    return this.artistSubject.getValue();
  }

  // Now accepts the original artist object (with id and name from your server)
  fetchArtists(originalArtist: {
    id: number;
    name: string;
  }): Observable<Artists[]> {
    return this.http
      .get<any>(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          originalArtist.name
        )}&entity=musicArtist`
      )
      .pipe(
        tap((rawResponse) => console.log('Raw search response:', rawResponse)),
        map((response) => response.results),
        switchMap((artists: any[]) => {
          // For each artist from iTunes API call lookup to get album info.
          const artistObservables = artists.map((artist) =>
            this.http
              .get<any>(
                `https://itunes.apple.com/lookup?id=${artist.artistId}&entity=album`
              )
              .pipe(
                map((albumResponse) => {
                  // Choose the first album that contains an artworkUrl100.
                  const album = albumResponse.results.find(
                    (result: any) =>
                      result.wrapperType === 'collection' &&
                      result.artworkUrl100
                  );
                  return {
                    // Preserve the original server id here
                    id: originalArtist.id,
                    // Other properties from iTunes API:
                    artistId: artist.artistId,
                    name: artist.artistName,
                    link: artist.artistLinkUrl,
                    genre: artist.primaryGenreName,
                    genreId: artist.primaryGenreId,
                    amgArtistId: artist.amgArtistId,
                    artistType: artist.artistType,
                    artworkUrl100: album ? album.artworkUrl100 : undefined,
                    collectionName: album ? album.collectionName : undefined,
                    releaseDate: album ? album.releaseDate : undefined,
                  };
                })
              )
          );
          return forkJoin(artistObservables);
        })
      );
  }
}

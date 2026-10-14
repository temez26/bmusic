import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@widgets/header';
import { PlayerComponent } from '@widgets/player';
import { AlbumStore } from '@entities/album';
import { ArtistStore } from '@entities/artist';
import { SongStore } from '@entities/song';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, PlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly songs = inject(SongStore);
  private readonly albums = inject(AlbumStore);
  private readonly artists = inject(ArtistStore);

  ngOnInit(): void {
    this.songs.load();
    this.albums.load();
    this.artists.load();
  }
}

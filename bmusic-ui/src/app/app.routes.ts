import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SongsComponent } from './home/songs/songs.component';
import { AlbumsComponent } from './home/albums/albums.component';
import { PlaylistsComponent } from './home/playlists/playlists.component';
import { ArtistsComponent } from './home/artists/artists.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'albums', component: AlbumsComponent },
  { path: 'playlists', component: PlaylistsComponent },
  { path: 'artists', component: ArtistsComponent },
];

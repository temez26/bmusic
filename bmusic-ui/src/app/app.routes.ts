import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SongsComponent } from './home/songs/songs.component';
import { AlbumsComponent } from './home/albums/albums.component';
import { PlaylistsComponent } from './home/playlists/playlists.component';
import { ArtistsComponent } from './home/artists/artists.component';
import { AlbumComponent } from './home/albums/album/album.component';
import { ArtistComponent } from './home/artists/artist/artist.component';
import { PlaylistComponent } from './home/playlists/playlist/playlist.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'albums', component: AlbumsComponent },
  { path: 'album/:albumId', component: AlbumComponent },
  { path: 'artist/:artistId', component: ArtistComponent },
  { path: 'playlists', component: PlaylistsComponent },
  { path: 'playlist/:playlistId', component: PlaylistComponent },
  { path: 'artists', component: ArtistsComponent },
];

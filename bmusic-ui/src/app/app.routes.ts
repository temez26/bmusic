import { Routes } from '@angular/router';
import { HomePageComponent } from '@pages/home';
import { SongsPageComponent } from '@pages/songs';
import { AlbumsPageComponent } from '@pages/albums';
import { AlbumPageComponent } from '@pages/album';
import { ArtistsPageComponent } from '@pages/artists';
import { ArtistPageComponent } from '@pages/artist';
import { PlaylistsPageComponent } from '@pages/playlists';
import { PlaylistPageComponent } from '@pages/playlist';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'songs', component: SongsPageComponent },
  { path: 'albums', component: AlbumsPageComponent },
  { path: 'album/:albumId', component: AlbumPageComponent },
  { path: 'artists', component: ArtistsPageComponent },
  { path: 'artist/:artistId', component: ArtistPageComponent },
  { path: 'playlists', component: PlaylistsPageComponent },
  { path: 'playlist/:playlistId', component: PlaylistPageComponent },
  { path: '**', redirectTo: '' },
];

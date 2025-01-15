import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SongsComponent } from './songs/songs.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'songs', component: SongsComponent },
];

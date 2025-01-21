import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopSongsComponent } from './top-songs/top-songs.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TopSongsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}

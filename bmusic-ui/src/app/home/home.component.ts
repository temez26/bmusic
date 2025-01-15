import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SongsComponent } from '../songs-home/songs-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SongsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}

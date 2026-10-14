import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopSongsComponent } from '@widgets/top-songs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, TopSongsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}

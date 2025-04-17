import { ArtistStateService } from '../../service/states/artist.state.service';
import {
  Component,
  OnInit,
  CommonModule,
  Router,
  RouterLink,
} from './artist-barrel';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
})
export class ArtistsComponent implements OnInit {
  artists: any[] = [];

  constructor(
    private artistState: ArtistStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.artistState.artists$.subscribe((artists) => {
      this.artists = artists;
    });
  }
  setArtist(artistId: number) {
    this.artistState.setCurrentArtist(artistId);
    this.router.navigate(['/artist', artistId]);
  }
}

import {
  ApiService,
  environment,
  Albums,
  AlbumStateService,
} from '../../service';
import {
  Component,
  OnInit,
  CommonModule,
  Router,
  RouterLink,
} from './album-barrel';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsComponent implements OnInit {
  albums: Albums[] = [];
  url: string = environment.apiBaseUrl;

  constructor(
    private albumState: AlbumStateService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.fetchAlbums().subscribe();
    this.albumState.albums$.subscribe((albums) => {
      this.albums = albums;
    });
  }

  setAlbum(albumId: number): void {
    this.albumState.setCurrentAlbum(albumId);
    this.router.navigate(['/album', albumId]);
  }
}

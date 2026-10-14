import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreatePlaylistFormComponent } from '@features/create-playlist';
import { DeletePlaylistComponent } from '@features/delete-playlist';
import { Playlist, PlaylistApi, playlistImage } from '@entities/playlist';

@Component({
  selector: 'app-playlists-page',
  standalone: true,
  imports: [RouterLink, CreatePlaylistFormComponent, DeletePlaylistComponent],
  templateUrl: './playlists-page.component.html',
  styleUrl: './playlists-page.component.scss',
})
export class PlaylistsPageComponent implements OnInit {
  private readonly api = inject(PlaylistApi);

  readonly playlists = signal<Playlist[]>([]);
  readonly playlistImage = playlistImage;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getAll().subscribe({
      next: (playlists) => this.playlists.set(playlists),
      error: (err) => console.error('Failed to load playlists', err),
    });
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Song, SongStore, SongTileComponent } from '@entities/song';
import { searchSongs } from '../lib/search-songs';

const MAX_RESULTS = 50;

@Component({
  selector: 'app-song-search',
  standalone: true,
  imports: [SongTileComponent],
  templateUrl: './song-search.component.html',
  styleUrl: './song-search.component.scss',
})
export class SongSearchComponent {
  @Output() songSelected = new EventEmitter<Song>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly songs = inject(SongStore);

  readonly query = signal('');
  readonly isOpen = signal(false);
  readonly results = computed(() =>
    searchSongs(this.songs.songs(), this.query()).slice(0, MAX_RESULTS)
  );

  select(song: Song): void {
    this.songSelected.emit(song);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { Playlist, PlaylistApi } from '@entities/playlist';
import { Song, SongStore } from '@entities/song';

const NOTIFICATION_MS = 2500;

/** Per-song actions: favorite, add to / remove from playlists, delete. */
@Component({
  selector: 'app-song-menu',
  standalone: true,
  templateUrl: './song-menu.component.html',
  styleUrl: './song-menu.component.scss',
})
export class SongMenuComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) song!: Song;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  /** Emitted after the song was added to or removed from a playlist. */
  @Output() playlistsChanged = new EventEmitter<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly playlistApi = inject(PlaylistApi);
  private readonly songStore = inject(SongStore);
  private notificationTimer?: ReturnType<typeof setTimeout>;

  readonly playlists = signal<Playlist[]>([]);
  readonly memberOf = signal<Set<number>>(new Set());
  readonly showPlaylists = signal(false);
  readonly notification = signal('');

  readonly favorites = computed(() => this.playlists().find((p) => p.protected) ?? null);
  readonly otherPlaylists = computed(() => this.playlists().filter((p) => !p.protected));

  ngOnChanges(): void {
    if (this.open) this.loadMembership();
    else this.showPlaylists.set(false);
  }

  ngOnDestroy(): void {
    clearTimeout(this.notificationTimer);
  }

  contains(playlist: Playlist): boolean {
    return this.memberOf().has(playlist.id);
  }

  toggleOpen(event: MouseEvent): void {
    event.stopPropagation();
    this.openChange.emit(!this.open);
  }

  togglePlaylist(playlist: Playlist): void {
    const inPlaylist = this.contains(playlist);
    const request = inPlaylist
      ? this.playlistApi.removeSong(playlist.id, this.song.id)
      : this.playlistApi.addSong(playlist.id, this.song.id);

    request.subscribe({
      next: () => {
        this.notify(inPlaylist ? `Removed from ${playlist.name}` : `Added to ${playlist.name}`);
        this.openChange.emit(false);
        this.playlistsChanged.emit();
      },
      error: () => this.notify(`Could not update ${playlist.name}`),
    });
  }

  deleteSong(): void {
    if (!confirm(`Delete "${this.song.title}" from the library? This removes the file.`)) {
      return;
    }
    this.songStore.remove(this.song.id).subscribe({
      next: () => this.openChange.emit(false),
      error: () => this.notify('Could not delete the song'),
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.host.nativeElement.contains(event.target as Node)) {
      this.openChange.emit(false);
    }
  }

  private loadMembership(): void {
    forkJoin({
      playlists: this.playlistApi.getAll(),
      memberOf: this.playlistApi.getIdsContainingSong(this.song.id),
    }).subscribe({
      next: ({ playlists, memberOf }) => {
        this.playlists.set(playlists);
        this.memberOf.set(new Set(memberOf));
      },
      error: (err) => console.error('Failed to load playlists', err),
    });
  }

  private notify(message: string): void {
    clearTimeout(this.notificationTimer);
    this.notification.set(message);
    this.notificationTimer = setTimeout(() => this.notification.set(''), NOTIFICATION_MS);
  }
}

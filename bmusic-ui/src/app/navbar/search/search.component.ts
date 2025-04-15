import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { fromEvent, BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';
import { SongsStateService } from '../../service/states/songs.state.service';
import { PlayComponent } from '../../home/shared/songs-list/play/play.component';
import { SongSearchService } from '../../service/states/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchDropdownComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('searchInput', { static: true })
  searchInput!: ElementRef<HTMLInputElement>;

  @ViewChild('searchContainer', { static: true })
  searchContainer!: ElementRef;

  // BehaviorSubject to always hold the current query value.
  private querySubject = new BehaviorSubject<string>('');

  // Observable search results updates whenever the querySubject emits a new value.
  searchResults$: Observable<any[]> = this.querySubject.pipe(
    debounceTime(50),
    switchMap((query) => this.searchService.searchSongs(query))
  );

  dropdownVisible = false;
  private hideTimeoutId: any;

  constructor(private searchService: SongSearchService) {}

  ngAfterViewInit() {
    // Listen for input events and update the querySubject.
    fromEvent(this.searchInput.nativeElement, 'input').subscribe(
      (event: Event) => {
        const query = (event.target as HTMLInputElement).value;
        this.dropdownVisible = true;
        this.querySubject.next(query);
      }
    );
  }

  onFocus() {
    this.dropdownVisible = true;
    // When focused, always push the current value into the subject
    // to trigger a new search even if the text hasn’t changed.
    const query = this.searchInput.nativeElement.value;
    this.querySubject.next(query);
  }

  onBlur() {
    // Delay hiding to allow interaction with dropdown.
    setTimeout(() => (this.dropdownVisible = false), 200);
  }

  onDropdownMouseDown(event: MouseEvent) {
    event.preventDefault();
  }

  onDropdownMouseEnter() {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }

  onDropdownMouseLeave() {
    this.hideTimeoutId = setTimeout(() => {
      this.dropdownVisible = false;
    }, 2000);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Hide the dropdown if the click is outside the search container.
    if (!this.searchContainer.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PlayComponent } from '../../../home/shared/songs-list/play/play.component';

@Component({
  selector: 'app-search-dropdown',
  standalone: true,
  imports: [CommonModule, PlayComponent],
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.scss'],
})
export class SearchDropdownComponent {
  @Input() results: any[] = [];
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { UploadComponent } from './upload/upload.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    SearchComponent,
    UploadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  showUpload = false;

  @ViewChild('uploadButton', { read: ElementRef }) uploadButton!: ElementRef;
  @ViewChild('uploadContainer', { read: ElementRef })
  uploadContainer!: ElementRef;

  toggleUpload() {
    console.log('clicked');
    this.showUpload = !this.showUpload;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // If upload is visible and the click is outside both the upload button and container, hide upload.
    if (
      this.showUpload &&
      this.uploadButton &&
      this.uploadContainer &&
      !this.uploadButton.nativeElement.contains(target) &&
      !this.uploadContainer.nativeElement.contains(target)
    ) {
      this.showUpload = false;
    }
  }
}

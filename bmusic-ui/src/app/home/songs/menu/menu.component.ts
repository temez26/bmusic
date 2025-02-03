import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';
import { DeleteComponent } from './delete/delete.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [DeleteComponent, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() isMenuOpen: boolean = false;
  @Output() toggleMenu = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  onToggleMenu() {
    this.toggleMenu.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.isMenuOpen &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.toggleMenu.emit();
    }
  }
}

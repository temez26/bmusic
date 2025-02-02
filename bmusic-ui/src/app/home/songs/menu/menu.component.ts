import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DeleteComponent } from './delete/delete.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [DeleteComponent, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  @Input() isMenuOpen: boolean = false;
  @Output() toggleMenu = new EventEmitter<void>();

  onToggleMenu() {
    this.toggleMenu.emit();
  }
}

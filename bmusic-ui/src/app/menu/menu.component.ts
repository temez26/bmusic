import { Component } from '@angular/core';
import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [DeleteComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {}

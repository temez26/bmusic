import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { UploadComponent } from './upload/upload.component';
import { RouterLink } from '@angular/router';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, SearchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private dialogRef: MatDialogRef<UploadComponent> | null = null;

  constructor(private dialog: MatDialog) {}

  toggleUploadDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    } else {
      this.dialogRef = this.dialog.open(UploadComponent);
    }
  }
}

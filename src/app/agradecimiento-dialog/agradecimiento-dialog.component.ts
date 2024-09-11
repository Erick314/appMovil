import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-agradecimiento-dialog',
  templateUrl: './agradecimiento-dialog.component.html',
})


export class AgradecimientoDialogComponent {
  constructor(public dialogRef: MatDialogRef<AgradecimientoDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}

// edit-empresa-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-empresa-dialog',
  templateUrl: './edit-empresa-dialog.component.html',
})
export class EditEmpresaDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEmpresaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      nombreEmpresa: [data.nombreEmpresa, Validators.required],
      rutEmpresa: [data.rutEmpresa, Validators.required],
      razonSocial: [data.razonSocial, Validators.required],
      region: [data.region, Validators.required],
    });
  }

  save() {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

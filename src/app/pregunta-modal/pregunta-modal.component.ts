import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../services/firebase.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-pregunta-modal',
  templateUrl: './pregunta-modal.component.html',
})
export class PreguntaModalComponent {
  pregunta = {
    pregunta: '',
    alternativaUno: '',
    alternativaDos: '',
    alternativaTres: '',
    vigencia: true
  };

  isEditMode: boolean = false; // Indica si el modal está en modo edición

  constructor(
    public dialogRef: MatDialogRef<PreguntaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe los datos de la pregunta
  ) {
    if (data) {
      this.pregunta = { ...data }; // Carga los datos en el formulario
      this.isEditMode = true; // Habilita el modo de edición
    }
  }

  // Método para cancelar
  onCancel(): void {
    this.dialogRef.close();
  }

  // Método para guardar la pregunta
  onSave(): void {
    this.dialogRef.close(this.pregunta); // Retorna los datos actualizados
  }
}

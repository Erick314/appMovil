import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../services/firebase.service';

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

  constructor(
    public dialogRef: MatDialogRef<PreguntaModalComponent>,
    private firebaseService: FirebaseService // Inyectar el servicio para guardar
  ) {}

  // Método para cancelar
  onCancel(): void {
    this.dialogRef.close();
  }

  // Método para guardar la pregunta
  onSave(): void {
    // Guardar la pregunta en Firebase con el servicio
    this.firebaseService.addPregunta(this.pregunta)
      .then(() => {
        console.log('Pregunta guardada exitosamente');
        this.dialogRef.close(this.pregunta);
      })
      .catch(error => {
        console.error('Error al guardar la pregunta:', error);
      });
  }
}

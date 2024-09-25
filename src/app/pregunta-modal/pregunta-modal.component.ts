import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pregunta-modal',
  templateUrl: './pregunta-modal.component.html',
  styleUrls: ['./pregunta-modal.component.css']
})
export class PreguntaModalComponent {
  pregunta = {
    idPregunta: 0,
    pregunta: '',
    alternativaUno: '',
    alternativaDos: '',
    alternativaTres: '',
    idEmpresa: 55, // Valor predeterminado para la empresa
    vigencia: false
  };

  constructor(
    public dialogRef: MatDialogRef<PreguntaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.pregunta.pregunta.trim() === '' || 
        this.pregunta.alternativaUno.trim() === '' || 
        this.pregunta.alternativaDos.trim() === '' || 
        this.pregunta.alternativaTres.trim() === '') {
      alert('Todos los campos son obligatorios');
    } else {
      this.dialogRef.close(this.pregunta);
    }
  }
}

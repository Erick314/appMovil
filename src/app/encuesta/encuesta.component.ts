import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AgradecimientoDialogComponent } from '../agradecimiento-dialog/agradecimiento-dialog.component';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent {
  selectedOptions: { [key: string]: string } = {};
  message: string = '';
  showAdditionalQuestions: boolean = false;  // Flag para mostrar o no las preguntas adicionales
  selectedEmojiValue: number | null = null;  // Valor del emoji seleccionado
  encuestaFinalizada: boolean = false;  // Flag para verificar si la encuesta ha sido finalizada

  constructor(private router: Router, public dialog: MatDialog) {}

  selectEmoji(emoji: number) {
    this.selectedEmojiValue = emoji;
    console.log(`Emoji seleccionado: ${emoji}`);
  }
  

  logout() {
    this.router.navigate(['/login']);
  }

  selectOption(question: string, option: string) {
    this.selectedOptions[question] = option;
  }

  updateMessage(event: any) {
    this.message = event.target.value;
  }

  // Opción para continuar con la encuesta
  continuarEncuesta() {
    this.showAdditionalQuestions = true;  // Mostrar el resto de las preguntas
  }

  // Opción para finalizar sin continuar con la encuesta
  finalizarEncuesta() {
    this.encuestaFinalizada = true;
    console.log('Emoji seleccionado, sin responder más preguntas:', this.selectedEmojiValue);
    this.router.navigate(['/encuesta-finalizada']);

  }

  // Enviar toda la encuesta
  submitSurvey() {
    console.log('Respuestas de la encuesta:', this.selectedOptions);
    console.log('Comentario adicional:', this.message);

    this.dialog.open(AgradecimientoDialogComponent);
  }
}

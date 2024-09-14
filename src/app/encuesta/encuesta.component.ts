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

  constructor(private router: Router, public dialog: MatDialog) {}
  selectEmoji(emoji: string) {
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

  submitSurvey() {
    console.log('Respuestas de la encuesta:', this.selectedOptions);
    console.log('Comentario adicional:', this.message);

    this.dialog.open(AgradecimientoDialogComponent);
  }
}

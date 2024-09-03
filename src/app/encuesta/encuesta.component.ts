import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent {
  selectedOptions: { [key: string]: string } = {};
  message: string = '';

  constructor(private router: Router) {}

  selectEmoji(emoji: string) {
    console.log(`Emoji seleccionado: ${emoji}`);
    // Aquí puedes agregar la lógica para manejar lo que pasa cuando se selecciona un emoji
  }

  logout() {
    // Aquí podrías agregar la lógica para cerrar sesión si es necesario
    this.router.navigate(['/login']);
  }

  selectOption(question: string, option: string) {
    this.selectedOptions[question] = option;
  }

  updateMessage(event: any) {
    this.message = event.target.value;
  }

  submitSurvey() {
    // Aquí puedes enviar los datos al servidor o hacer algo con la respuesta
    console.log('Respuestas de la encuesta:', this.selectedOptions);
    console.log('Comentario adicional:', this.message);
  }
}

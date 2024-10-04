import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {
  selectedOptions: { [key: string]: string } = {};
  message: string = '';
  showAdditionalQuestions: boolean = false;
  selectedEmojiValue: number | null = null;
  encuestaFinalizada: boolean = false;
  usuarioLogueado: any = null;
  preguntas: any[] = []; // Aquí almacenamos las preguntas asignadas

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.getUsuarioLogueado();
  
    // Obtener todas las preguntas desde Firebase, sin filtrar por sucursal
    this.firebaseService.getPreguntas().subscribe(preguntas => {
      this.preguntas = preguntas; // Almacenar todas las preguntas en el arreglo
      console.log('Preguntas obtenidas:', this.preguntas);
    });
  }

  selectEmoji(emoji: number) {
    this.selectedEmojiValue = emoji;
    console.log(`Emoji seleccionado: ${emoji}`);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  selectOption(question: string, option: string) {
    this.selectedOptions[question] = option;
    console.log(`Pregunta ${question} seleccionada: ${option}`);
  }
  

  getFormattedDate(): string {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  updateMessage(event: any) {
    this.message = event.target.value;
  }

  continuarEncuesta() {
    this.showAdditionalQuestions = true;
  }

  finalizarEncuesta() {
    if (this.usuarioLogueado) {
      const respuestasEncuesta = {
        emojiSeleccionado: this.selectedEmojiValue,
        pregunta1: this.preguntas[0] ? this.preguntas[0].pregunta : '', 
        respuesta1: this.preguntas[0] ? (this.selectedOptions[this.preguntas[0].idPregunta] || '') : '', 
        pregunta2: this.preguntas[1] ? this.preguntas[1].pregunta : '', 
        respuesta2: this.preguntas[1] ? (this.selectedOptions[this.preguntas[1].idPregunta] || '') : '', 
        pregunta3: this.preguntas[2] ? this.preguntas[2].pregunta : '', 
        respuesta3: this.preguntas[2] ? (this.selectedOptions[this.preguntas[2].idPregunta] || '') : '', 
        comentarioAdicional: this.message,
        usuario: this.usuarioLogueado.nombre,
        empresa: this.usuarioLogueado.idEmpresa,
        fechaRealizacion: this.getFormattedDate()
      };
  
      this.firebaseService.guardarEncuesta(respuestasEncuesta).then(() => {
        console.log('Encuesta guardada correctamente');
        this.router.navigate(['/agradecimiento']);
      }).catch(err => {
        console.error('Error al guardar la encuesta:', err);
      });
    } else {
      console.error('No hay usuario logueado. No se puede guardar la encuesta.');
    }
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta-finalizada',
  templateUrl: './encuesta-finalizada.component.html',
  styleUrls: ['./encuesta-finalizada.component.css']
})
export class EncuestaFinalizadaComponent {

  constructor(private router: Router) {}

  nuevaEncuesta() {
    this.router.navigate(['/encuesta']); // Redirige al componente de la encuesta
  }

  iniciarSesion() {
    this.router.navigate(['/login']); // Redirige al componente de login
  }
}

import { Component,ViewChild  } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  @ViewChild('sidenav') sidenav?: MatSidenav;
  
  constructor(private router: Router) {}

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
  logout() {
    // Aquí podrías agregar la lógica para cerrar sesión si es necesario
    this.router.navigate(['/login']);
  }
}

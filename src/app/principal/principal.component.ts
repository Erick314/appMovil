import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Importa el servicio de autenticación

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})

export class PrincipalComponent implements OnInit {
  @ViewChild('sidenav') sidenav?: MatSidenav;
  usuarioLogueado: any = null; 

  constructor(
    private router: Router,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    // Obtener los datos del usuario logueado desde el AuthService
    this.usuarioLogueado = this.authService.getUsuarioLogueado();
    
    if (!this.usuarioLogueado) {
      console.error('No se pudo obtener el usuario logueado.');
    }
  }
  

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  CambioPestana(pestaña: string) {
    this.router.navigate([pestaña]);
  }
}

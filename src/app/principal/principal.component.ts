import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  
import { FirebaseService } from '../services/firebase.service'; 

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})

export class PrincipalComponent implements OnInit {
  @ViewChild('sidenav') sidenav?: MatSidenav;
  usuarioLogueado: any = null; 
  cantidadSucursales: number = 0; // Para contar sucursales
  cantidadPreguntas: number = 0;  // Para contar preguntas

  constructor(
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService // Inyectar el servicio de Firebase
  ) {}

  ngOnInit(): void {
    // Obtener los datos del usuario logueado
    this.usuarioLogueado = this.authService.getUsuarioLogueado();
    
    if (!this.usuarioLogueado) {
      return;
    }

    // Cargar sucursales y preguntas según el tipo de usuario
    this.cargarDatos();
  }

  cargarDatos() {
    // Cargar sucursales
    this.firebaseService.getSucursalesEmpresa().subscribe((sucursales: any[]) => {
      this.cantidadSucursales = sucursales.length;
    });

    // Cargar preguntas
    this.firebaseService.getPreguntas().subscribe((preguntas: any[]) => {
      this.cantidadPreguntas = preguntas.length;
    });
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

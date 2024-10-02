import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';  
import { AuthService } from '../services/auth.service';  // Importar el AuthService
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  sucursalForm: FormGroup;
  displayedColumns: string[] = [ 'nombreSucursal', 'direccion', 'vigencia'];
  sucursales = new MatTableDataSource();  

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private authService: AuthService  // Inyectar AuthService
  ) {
    // Inicializar el formulario de sucursal
    this.sucursalForm = this.fb.group({
      nombreSucursal: ['', Validators.required],
      direccion: ['', Validators.required],
      vigencia: [true]  
    });

    // Obtener el usuario logueado desde AuthService
    const usuario = this.authService.getUsuarioLogueado(); 

    if (usuario) {
      if (usuario.tipoUsuario === 'SuperAdmin') {
        // Si el usuario es SuperAdmin, obtener todas las sucursales
        this.firebaseService.getSucursales().subscribe({
          next: (data: any[]) => {
            this.sucursales.data = data;
          },
          error: (error) => {
            console.error('Error al obtener sucursales: ', error);
          }
        });
      } else if (usuario.idEmpresa) {
        // Si el usuario no es SuperAdmin, obtener sucursales filtradas por idEmpresa
        this.firebaseService.getSucursalesByEmpresa(usuario.idEmpresa).subscribe({
          next: (data: any[]) => {
            this.sucursales.data = data;
          },
          error: (error) => {
            console.error('Error al obtener sucursales: ', error);
          }
        });
      } else {
        console.error('Error: Usuario no autenticado o sin idEmpresa.');
      }
    } else {
      console.error('Error: No se encontró el usuario logueado.');
    }
  }

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }

  CambioPestana(pestaña: string) {
    this.router.navigate(['/' + pestaña]);
  }

  // Función para crear una nueva sucursal
  crearSucursal() {
    if (this.sucursalForm.valid) {
      const nuevaSucursal = {
        nombreSucursal: this.sucursalForm.value.nombreSucursal,
        direccion: this.sucursalForm.value.direccion
      };
  
      // Guardar la nueva sucursal en Firebase
      this.firebaseService.addSucursal(nuevaSucursal)
        .then(() => {
          console.log('Sucursal creada exitosamente');
          this.sucursalForm.reset({ vigencia: true });  // Restablecer el formulario
        })
        .catch(error => {
          console.error('Error al crear sucursal: ', error);
        });
    }
  }
}

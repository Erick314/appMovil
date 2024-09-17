import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  sucursalForm: FormGroup;
  displayedColumns: string[] = ['idSucursal', 'nombreSucursal', 'direccion', 'vigencia'];
  
  // Lista de sucursales que se mostrará en la tabla usando MatTableDataSource
  sucursales = new MatTableDataSource([
    { idSucursal: 1, nombreSucursal: 'Sucursal Centro', direccion: 'Calle Principal 123', vigencia: 'Vigente' },
    { idSucursal: 2, nombreSucursal: 'Sucursal Las Palmas', direccion: 'Avenida Palmeras 456', vigencia: 'Vigente' },
    { idSucursal: 3, nombreSucursal: 'Sucursal La Rivera', direccion: 'Calle Marina 789', vigencia: 'No Vigente' },
    { idSucursal: 4, nombreSucursal: 'Sucursal Plaza Norte', direccion: 'Avenida Norte 12', vigencia: 'Vigente' },
    { idSucursal: 5, nombreSucursal: 'Sucursal Los Olivos', direccion: 'Calle Los Olivos 34', vigencia: 'No Vigente' },
  ]);
  

  constructor(private router: Router, private fb: FormBuilder) {
    // Inicializar el formulario de sucursal
    this.sucursalForm = this.fb.group({
      nombreSucursal: ['', Validators.required],
      direccion: ['', Validators.required],
      vigencia: [true]  // Establecido en true por defecto
    });
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
        idSucursal: this.sucursales.data.length + 1,
        nombreSucursal: this.sucursalForm.value.nombreSucursal,
        direccion: this.sucursalForm.value.direccion,
        vigencia: this.sucursalForm.value.vigencia ? 'Vigente' : 'No Vigente'
      };

      // Añadir la nueva sucursal a la lista de datos de la tabla
      const sucursalesActualizadas = [...this.sucursales.data, nuevaSucursal];
      this.sucursales.data = sucursalesActualizadas;  // Actualiza la tabla

      // Resetear el formulario después de crear la sucursal
      this.sucursalForm.reset({ vigencia: true });
    }
  }
}

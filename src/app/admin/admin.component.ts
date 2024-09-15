import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  empresaNombre: string = '';
  sucursalNombre: string = '';
  empresas: any[] = [];
  sucursales: any[] = [];
  displayedColumns: string[] = ['nombre'];

  constructor(private router : Router) {}

  crearEmpresa() {
    if (this.empresaNombre) {
      this.empresas.push({ nombre: this.empresaNombre });
      this.empresaNombre = '';
    }
  }

  crearSucursal() {
    if (this.sucursalNombre) {
      this.sucursales.push({ nombre: this.sucursalNombre });
      this.sucursalNombre = '';
    }
  }

  navigate(pestana: string) {
    console.log('Navegar a:', pestana);
    // Aquí puedes implementar la lógica de navegación si decides añadir rutas más adelante
  }

  logout() {
    console.log('Cerrar sesión');
    // Aquí puedes implementar la lógica de cerrar sesión si es necesario
  }
  ngOnInit() {
    // Simulación de datos obtenidos, reemplazar con tu lógica de obtención de datos
    this.empresas = [
      { nombre: 'Empresa 1' },
      { nombre: 'Empresa 2' }
    ];

    this.sucursales = [
      { nombre: 'Sucursal A' },
      { nombre: 'Sucursal B' }
    ];
  }
  CambioPestana(pestaña: string) {
    // Aquí podrías agregar la lógica para cerrar sesión si es necesario
    this.router.navigate(['/'+pestaña]);
  }
}

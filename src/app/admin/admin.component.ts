import { Component } from '@angular/core';

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

  constructor() {}

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
}

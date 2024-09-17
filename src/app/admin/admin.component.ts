import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  empresaNombre: string = '';
  rutEmpresa: string = '';
  razonSocial: string = '';
  pais: string = '';

  displayedColumns: string[] = ['idEmpresa', 'nombreEmpresa', 'rutEmpresa', 'codigoEmpresa', 'pais', 'fechaCreacion', 'vigencia'];

  empresas = new MatTableDataSource<any>();

  constructor(private router: Router) {}

  // Método para obtener la fecha actual en formato dd-MM-yyyy
  getFormattedDate(): string {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Método para generar un código aleatorio de 10 caracteres
  generarCodigoEmpresa(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 10; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  }

  // Método para crear una empresa y actualizar la tabla
  crearEmpresa() {
    if (this.empresaNombre && this.rutEmpresa && this.razonSocial && this.pais) {
      const nuevaEmpresa = {
        idEmpresa: this.empresas.data.length + 1,
        nombreEmpresa: this.empresaNombre,
        rutEmpresa: this.rutEmpresa,
        razonSocial: this.razonSocial,
        pais: this.pais,
        codigoEmpresa: this.generarCodigoEmpresa(), // Generar código aleatorio
        fechaCreacion: this.getFormattedDate(),
        vigencia: 'Vigente'
      };
      const data = this.empresas.data;  // Obtener datos actuales
      data.push(nuevaEmpresa);          // Agregar la nueva empresa
      this.empresas.data = data;        // Actualizar la tabla
      this.limpiarCampos();             // Limpiar los campos de entrada después de agregar
    }
  }

  // Método para limpiar los campos del formulario después de agregar una empresa
  limpiarCampos() {
    this.empresaNombre = '';
    this.rutEmpresa = '';
    this.razonSocial = '';
    this.pais = '';
  }

  toggleSidenav() {
    // Función para manejar el sidenav
  }

  logout() {
    console.log('Cerrar sesión');
  }

  ngOnInit() {
    // Datos iniciales de empresas (ejemplo)
    this.empresas.data = [
      { idEmpresa: 1, nombreEmpresa: 'TechSol', rutEmpresa: '12345678-9', codigoEmpresa: 'abc123def4', pais: 'Chile', fechaCreacion: '01-01-2023', vigencia: 'Vigente' },
      { idEmpresa: 2, nombreEmpresa: 'InnovaTech', rutEmpresa: '98765432-1', codigoEmpresa: 'xys987lmn2', pais: 'Perú', fechaCreacion: '15-02-2023', vigencia: 'Vigente' }
    ];
  }

  CambioPestana(pestaña: string) {
    this.router.navigate(['/' + pestaña]);
  }
}

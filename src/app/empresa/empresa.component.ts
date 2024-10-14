import { Component, OnInit , ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseService } from '../services/firebase.service'; 
import { AuthService } from '../services/auth.service';  
import { MatSidenav } from '@angular/material/sidenav';



@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent {
  usuarioLogueado: any = null; 
  empresaNombre: string = '';
  rutEmpresa: string = '';
  razonSocial: string = '';
  region: string = '';
  @ViewChild('sidenav') sidenav?: MatSidenav;


  regiones: string[] = [
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana de Santiago',
    'Libertador General Bernardo O\'Higgins',
    'Maule',
    'Ñuble',
    'Biobío',
    'La Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén del General Carlos Ibáñez del Campo',
    'Magallanes y de la Antártica Chilena'
  ];

  displayedColumns: string[] = ['idEmpresa', 'nombreEmpresa', 'rutEmpresa', 'codigoEmpresa', 'region', 'fechaCreacion', 'vigencia'];

  empresas = new MatTableDataSource<any>();

  constructor(
    private router: Router, 
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

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

  // Método para crear una empresa y guardar en Firestore
  crearEmpresa() {
    if (this.empresaNombre && this.rutEmpresa && this.razonSocial && this.region) {
      const nuevaEmpresa = {
        idEmpresa: this.empresas.data.length + 1, // Si necesitas un ID, puedes usar esto o usar el auto-generado de Firestore.
        nombreEmpresa: this.empresaNombre,
        rutEmpresa: this.rutEmpresa,
        razonSocial: this.razonSocial,
        region: this.region,
        codigoEmpresa: this.generarCodigoEmpresa(), // Generar código aleatorio
        fechaCreacion: this.getFormattedDate(),
        vigencia: 'Vigente'
      };
      this.firebaseService.addEmpresa(nuevaEmpresa).then(() => {
        console.log('Empresa agregada exitosamente a Firestore');
        this.limpiarCampos(); // Limpiar los campos del formulario después de agregar
      }).catch(error => {
        console.error('Error al agregar empresa a Firestore: ', error);
      });
    }
  }

  // Método para limpiar los campos del formulario después de agregar una empresa
  limpiarCampos() {
    this.empresaNombre = '';
    this.rutEmpresa = '';
    this.razonSocial = '';
    this.region = '';
  }

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }  }

    logout() {
      this.authService.logout().then(() => {
        this.router.navigate(['/login']);
      });
    }

  ngOnInit() {
    // Obtener las empresas desde Firestore
    this.firebaseService.getEmpresas().subscribe(empresas => {
      this.empresas.data = empresas;
    });
    this.usuarioLogueado = this.authService.getUsuarioLogueado();
    
    if (!this.usuarioLogueado) {
      return;
    }

  }

  CambioPestana(pestaña: string) {
    this.router.navigate(['/' + pestaña]);
  }

}

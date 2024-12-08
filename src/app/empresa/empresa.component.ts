import { Component, OnInit , ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseService } from '../services/firebase.service'; 
import { AuthService } from '../services/auth.service';  
import { MatSidenav } from '@angular/material/sidenav';
import { EditEmpresaDialogComponent } from '../edit-empresa-dialog/edit-empresa-dialog.component';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
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

  displayedColumns: string[] = ['idEmpresa', 'nombreEmpresa', 'rutEmpresa', 'codigoEmpresa', 'region', 'fechaCreacion', 'vigencia', 'editar', 'eliminar'];

  empresas = new MatTableDataSource<any>();

  constructor(
    private router: Router, 
    private firebaseService: FirebaseService,
    private authService: AuthService,
    public dialog: MatDialog

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
    const nuevaEmpresa = {
      idEmpresa: this.empresas.data.length + 1,
      nombreEmpresa: this.empresaNombre,
      rutEmpresa: this.rutEmpresa,
      razonSocial: this.razonSocial,
      region: this.region,
      codigoEmpresa: this.generarCodigoEmpresa(),
      fechaCreacion: this.getFormattedDate(),
      vigencia: 'Vigente'
    };
  
    console.log('Enviando nueva empresa:', nuevaEmpresa);
  
    this.firebaseService.addEmpresa(nuevaEmpresa).subscribe(
      (response) => {
        console.log('Empresa agregada exitosamente:', response);
        this.empresas.data.push(response); // Agregar la empresa a la tabla
        this.empresas._updateChangeSubscription(); // Actualizar la tabla
        this.limpiarCampos();
      },
      (error) => {
        console.error('Error al agregar empresa: ', error);
      }
    );
  }
  
  eliminarEmpresa(codigoEmpresa: string, idEmpresa: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
      this.firebaseService.deleteEmpresa(codigoEmpresa, idEmpresa).subscribe(
        () => {
          console.log('Empresa eliminada con éxito');
          // Actualizar la tabla eliminando la empresa
          this.empresas.data = this.empresas.data.filter(empresa =>
            empresa.codigoEmpresa !== codigoEmpresa || empresa.idEmpresa !== idEmpresa
          );
          this.empresas._updateChangeSubscription(); // Actualizar la tabla
        },
        (error) => {
          console.error('Error al eliminar empresa: ', error);
        }
      );
    }
  }
  
  
  editarEmpresa(empresa: any) {
    const dialogRef = this.dialog.open(EditEmpresaDialogComponent, {
      width: '400px',
      data: { ...empresa, regiones: this.regiones }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const empresaActualizada = {
          ...empresa,
          ...result
        };
        this.firebaseService.updateEmpresa(empresa.codigoEmpresa, empresaActualizada).subscribe(
          () => {
            console.log('Empresa actualizada con éxito');
            const index = this.empresas.data.findIndex(e => e.codigoEmpresa === empresa.codigoEmpresa);
            if (index !== -1) {
              this.empresas.data[index] = empresaActualizada;
              this.empresas._updateChangeSubscription(); // Actualizar la tabla
            }
          },
          (error) => {
            console.error('Error al actualizar empresa: ', error);
          }
        );
      }
    });
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
        this.router.navigate(['/login']); // Redirige al usuario al login
      }).catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
    }
    
    

    ngOnInit() {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']); // Redirige al login si no está autenticado
        return;
      }
    
      this.firebaseService.getEmpresas().subscribe(
        (empresas) => {
          this.empresas.data = empresas;
        },
        (error) => {
          console.error('Error al obtener empresas:', error);
          if (error.status === 403) {
            this.router.navigate(['/login']); // Redirige al login si el token es inválido
          }
        }
      );
    
      this.usuarioLogueado = this.authService.getUsuarioLogueado();
    }
    
    

  CambioPestana(pestaña: string) {
    this.router.navigate(['/' + pestaña]);
  }

}

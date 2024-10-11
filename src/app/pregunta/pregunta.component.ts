import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PreguntaModalComponent } from '../pregunta-modal/pregunta-modal.component';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';


interface Pregunta {
  idPregunta: number;
  pregunta: string;
  alternativaUno: string;
  alternativaDos: string;
  alternativaTres: string;
  vigencia: boolean;
}

interface Sucursal {
  nombreSucursal: string;
}

interface Asignacion {
  idSucursalPregunta: string;
  nombreSucursal: string;
  pregunta: string;
  fechaAsignacion: string;
}

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css']
})
export class PreguntaComponent {
  @ViewChild('sidenav') sidenav?: MatSidenav;
  displayedColumns: string[] = ['idPregunta', 'pregunta', 'alternativaUno', 'alternativaDos', 'alternativaTres', 'vigencia'];
  displayedColumnsAsignaciones: string[] = [ 'nombreSucursal', 'pregunta', 'fechaAsignacion'];
  usuarioLogueado: any = null; 
  preguntas: Pregunta[] = [];
  sucursales: Sucursal[] = [];
  todasLasPreguntasAsignadas: Asignacion[] = [];
  selectedSucursal: string = ''; 
  preguntasAsignadas: Pregunta[] = [];

  constructor(private router: Router, public dialog: MatDialog, private firebaseService: FirebaseService, private authService: AuthService) {


    // Obtener preguntas desde Firebase
    
    const usuario = this.authService.getUsuarioLogueado(); 

    if (usuario.idEmpresa === 3) {
      // Si es SuperAdmin, obtener todas las sucursales y asignaciones
      this.firebaseService.getSucursales().subscribe((sucursalesData: any[]) => {
        this.sucursales = sucursalesData;
        // Cargar todas las asignaciones
        this.firebaseService.getAsignaciones().subscribe((asignacionesData: any[]) => {
          this.todasLasPreguntasAsignadas = asignacionesData;

          this.firebaseService.getPreguntas().subscribe((data: any[]) => {
            this.preguntas = data;  });
          
        });
      });
    } else {
      // Si no es SuperAdmin, obtener solo las sucursales de la empresa del usuario
      this.firebaseService.getSucursalesByEmpresa(usuario.idEmpresa).subscribe((sucursalesData: any[]) => {
        this.sucursales = sucursalesData;

        // Filtrar las asignaciones para que solo incluyan las de las sucursales disponibles
        const nombresSucursales = this.sucursales.map(sucursal => sucursal.nombreSucursal);

        this.firebaseService.getAsignaciones().subscribe((asignacionesData: any[]) => {
          this.todasLasPreguntasAsignadas = asignacionesData.filter(asignacion =>
            nombresSucursales.includes(asignacion.nombreSucursal)
          );
          this.firebaseService.getPreguntas().subscribe((data: any[]) => {
            this.preguntas = data.filter(pregunta =>
              pregunta.empresa === usuario.idEmpresa || pregunta.empresa === 3
          );       
         });
        });
      });
    }
  }

  cargarPreguntasAsignadas() {
    if (!this.selectedSucursal) {
      this.preguntasAsignadas = [];
      return;
    }
  
    // Obtener los nombres de las sucursales disponibles
    const sucursalesDisponibles = this.sucursales.map(sucursal => sucursal.nombreSucursal);
  
    // Filtrar las preguntas asignadas solo para las sucursales disponibles y la sucursal seleccionada
    this.preguntasAsignadas = this.todasLasPreguntasAsignadas
      .filter(asignacion => 
        sucursalesDisponibles.includes(asignacion.nombreSucursal) &&
        asignacion.nombreSucursal === this.selectedSucursal
      )
      .map(asignacion => {
        const pregunta = this.preguntas.find(p => p.pregunta === asignacion.pregunta);
        return pregunta ? pregunta : { idPregunta: 0, pregunta: '', alternativaUno: '', alternativaDos: '', alternativaTres: '', vigencia: false };
      });
  }
  
  
  openDialog(): void {
    const dialogRef = this.dialog.open(PreguntaModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.preguntas.push(result);
      }
    });
  }

  asignarPreguntas(preguntasSeleccionadas: any[]) {
    if (this.selectedSucursal && preguntasSeleccionadas.length > 0) {
      const fechaAsignacion = this.firebaseService.getFormattedDate();
  
      preguntasSeleccionadas.forEach(preguntaSeleccionada => {
        const preguntaData = preguntaSeleccionada.value;  // Obtener los datos de la pregunta seleccionada
        
        // Verificar si la pregunta ya está asignada a la sucursal
        const asignacionExistente = this.todasLasPreguntasAsignadas.find(asignacion => 
          asignacion.nombreSucursal === this.selectedSucursal && asignacion.pregunta === preguntaData.pregunta
        );
  
        if (asignacionExistente) {
          console.warn('La pregunta ya ha sido asignada a esta sucursal:', preguntaData.pregunta);
        } else {
          const nuevaAsignacion: Asignacion = {
            idSucursalPregunta: this.firebaseService.generateUniqueId(),  // Generar un ID único para la asignación
            nombreSucursal: this.selectedSucursal,  // La sucursal seleccionada
            pregunta: preguntaData.pregunta,  // El texto de la pregunta seleccionada
            fechaAsignacion: fechaAsignacion  // Fecha actual formateada
          };
  
          // Añadir la asignación a Firebase
          this.firebaseService.addAsignacion(nuevaAsignacion).then(() => {
            console.log('Asignación guardada en Firebase:', nuevaAsignacion);
  
            // Actualizar el arreglo local de todas las preguntas asignadas
            this.todasLasPreguntasAsignadas.push(nuevaAsignacion);
  
            // Refrescar la vista localmente sin recargar la página
            this.todasLasPreguntasAsignadas = [...this.todasLasPreguntasAsignadas];
  
          }).catch(err => {
            console.error('Error guardando la asignación en Firebase:', err);
          });
        }
      });
    } else {
      console.warn('Debe seleccionar una sucursal y al menos una pregunta para asignar.');
    }
  }
  
  
  
  CambioPestana(pestaña: string) {
    this.router.navigate(['/' + pestaña]);
  }

  logout() {
    this.router.navigate(['/login']);
  }
  ngOnInit() {
    this.usuarioLogueado = this.authService.getUsuarioLogueado();
    
    if (!this.usuarioLogueado) {
      return;
    }

  }
  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}

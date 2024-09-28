import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PreguntaModalComponent } from '../pregunta-modal/pregunta-modal.component'; // Importa el modal

interface Pregunta {
  idPregunta: number;
  pregunta: string;
  alternativaUno: string;
  alternativaDos: string;
  alternativaTres: string;
  vigencia: boolean;
}

interface Sucursal {
  id: number;
  nombre: string;
}

interface Asignacion {
  idSucursalPregunta: number;
  idSucursal: number;
  idPregunta: number;
  sucursal: string;
  pregunta: string;
}

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css']
})
export class PreguntaComponent {
  // Lista de columnas a mostrar en la tabla de preguntas asignadas
  displayedColumns: string[] = [
    'idPregunta',
    'pregunta',
    'alternativaUno',
    'alternativaDos',
    'alternativaTres',
    'vigencia'
  ];
  // Columnas para la tabla de preguntas asignadas
  displayedColumnsAsignaciones: string[] = [
    'idSucursalPregunta',
    'sucursal',
    'idPregunta',
    'pregunta'
  ];


  // Datos iniciales
  preguntas: Pregunta[] = [
    { idPregunta: 1, pregunta: '¿Cuál es tu color favorito?', alternativaUno: 'Rojo', alternativaDos: 'Azul', alternativaTres: 'Verde', vigencia: true },
    { idPregunta: 2, pregunta: '¿Cuál es tu animal favorito?', alternativaUno: 'Perro', alternativaDos: 'Gato', alternativaTres: 'Pez', vigencia: true }
  ];

  sucursales: Sucursal[] = [
    { id: 1, nombre: 'Sucursal 1' },
    { id: 2, nombre: 'Sucursal 2' },
    { id: 3, nombre: 'Sucursal 3' }
  ];

  // Lista de preguntas asignadas a la sucursal seleccionada
  preguntasAsignadas: Pregunta[] = [];
  // Lista de todas las preguntas asignadas a todas las sucursales
  todasLasPreguntasAsignadas: Asignacion[] = [];

  // Cambia el tipo de selectedSucursal a number y asigna un valor por defecto
  selectedSucursal: number = 1; // Asigna una sucursal por defecto para evitar null

  constructor(private router: Router, public dialog: MatDialog) {}

  // Abrir modal para crear nueva pregunta
  openDialog(): void {
    const dialogRef = this.dialog.open(PreguntaModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.idPregunta = this.preguntas.length + 1; // Asignar un ID único
        this.preguntas.push(result);
        this.preguntas = [...this.preguntas];// Esto lo hacemos para forzar que al guardar actualice la tabla con la nueva data


      }
    });
  }

  // Cargar preguntas asignadas a la sucursal seleccionada
  cargarPreguntasAsignadas() {
    console.log('Sucursal seleccionada:', this.selectedSucursal); // Verificar sucursal seleccionada
    if (this.selectedSucursal !== null) { // Asegurarse de que no sea null, aunque ya no debería ser necesario
      // Filtrar preguntas asignadas según la sucursal seleccionada
      this.preguntasAsignadas = this.todasLasPreguntasAsignadas
        .filter(asignacion => asignacion.idSucursal === this.selectedSucursal)
        .map(asignacion => {
          const pregunta = this.preguntas.find(p => p.idPregunta === asignacion.idPregunta);
          console.log('Pregunta encontrada para la asignación:', pregunta); // Verificar pregunta encontrada
          return pregunta ? pregunta : { idPregunta: 0, pregunta: '', alternativaUno: '', alternativaDos: '', alternativaTres: '', vigencia: false };
        });
      console.log('Preguntas asignadas a la sucursal:', this.preguntasAsignadas); // Verificar preguntas asignadas cargadas
    }
  }
    

  asignarPreguntas(preguntasSeleccionadas: any[]) {
    console.log('Preguntas seleccionadas:', preguntasSeleccionadas); // Verificar preguntas seleccionadas
    if (this.selectedSucursal !== null) {
      preguntasSeleccionadas.forEach(pregunta => {
        console.log('Asignando pregunta:', pregunta.value); // Verificar cada pregunta antes de asignar
        if (!this.todasLasPreguntasAsignadas.find(p => p.idPregunta === pregunta.value.idPregunta && p.idSucursal === this.selectedSucursal)) {
          const nuevaAsignacion = {
            idSucursalPregunta: this.todasLasPreguntasAsignadas.length + 1, // Generar ID único
            idSucursal: this.selectedSucursal, // selectedSucursal ahora es siempre un número
            idPregunta: pregunta.value.idPregunta,
            sucursal: this.sucursales.find(s => s.id === this.selectedSucursal)?.nombre || '',
            pregunta: pregunta.value.pregunta
          };
          this.todasLasPreguntasAsignadas.push(nuevaAsignacion);
          console.log('Nueva asignación:', nuevaAsignacion); // Verificar nueva asignación
        } else {
          console.log('La pregunta ya está asignada a esta sucursal.'); // Mensaje si la pregunta ya está asignada
        }
      });
      this.cargarPreguntasAsignadas(); // Recargar preguntas asignadas
      console.log('Preguntas asignadas después de la operación:', this.todasLasPreguntasAsignadas); // Verificar lista completa de asignaciones
      
      // Asegurar que Angular detecte cambios en el dataSource
      this.todasLasPreguntasAsignadas = [...this.todasLasPreguntasAsignadas];
    }
  }
  


  // Cambiar de pestaña
  CambioPestana(pestaña: string) {
    this.router.navigate(['/' + pestaña]);
  }
  logout() {
    this.router.navigate(['/login']);
  }
}

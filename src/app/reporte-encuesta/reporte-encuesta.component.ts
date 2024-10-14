import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as XLSXStyle from 'xlsx-style';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service'; // Servicio para obtener datos de Firebase

@Component({
  selector: 'app-reporte-encuesta',
  templateUrl: './reporte-encuesta.component.html',
  styleUrls: ['./reporte-encuesta.component.css']
})
export class ReporteEncuestaComponent implements OnInit {
  @ViewChild('sidenav') sidenav?: MatSidenav;
  usuarioLogueado: any = null;
  displayedColumns: string[] = ['usuario', 'calificacion', 'pregunta1', 'respuesta1', 'pregunta2', 'respuesta2', 'pregunta3', 'respuesta3', 'pregunta4', 'respuesta4', 'pregunta5', 'respuesta5'];

  encuestas: any[] = []; // Array para almacenar las encuestas obtenidas de la base de datos
  filteredData: any[] = []; // Array para almacenar los datos filtrados
  searchText: string = ''; // Variable para el filtro

  constructor(
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService // Inyectar el servicio de Firebase
  ) {}

  ngOnInit() {
    this.usuarioLogueado = this.authService.getUsuarioLogueado();

    if (!this.usuarioLogueado) {
      console.error("No hay usuario logueado.");
      return;
    }

    // Obtener las encuestas desde la base de datos
    this.firebaseService.getEncuestas().subscribe((data: any[]) => {
      // Filtrar las encuestas según el tipo de usuario
      this.encuestas = this.usuarioLogueado.tipoUsuario === 'SuperAdmin'
        ? data
        : data.filter(encuesta => encuesta.empresa === this.usuarioLogueado.idEmpresa);
      
      // Inicializar los datos filtrados con las encuestas obtenidas
      this.filteredData = [...this.encuestas];
    });
  }

  // Método para filtrar encuestas por sucursal o empresa
  filtrarPorSucursalOEmpresa() {
    if (this.searchText) {
      this.filteredData = this.encuestas.filter(encuesta =>
        (encuesta.usuario || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (encuesta.sucursal || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (encuesta.empresa || '').toString().includes(this.searchText)
      );
    } else {
      this.filteredData = [...this.encuestas];
    }
  }

  // Método para exportar los datos a Excel
  exportarExcel() {
    if (!this.usuarioLogueado) {
      console.error("No hay usuario logueado.");
      return;
    }

    // Construir encabezados personalizados
    const header = [['Usuario', 'Calificación', 'Pregunta 1', 'Respuesta 1', 'Pregunta 2', 'Respuesta 2', 'Pregunta 3', 'Respuesta 3', 'Pregunta 4', 'Respuesta 4', 'Pregunta 5', 'Respuesta 5']];

    // Convertir los datos de encuestas al formato requerido para el cuerpo
    const data = this.filteredData.map(encuesta => [
      encuesta.usuario,
      encuesta.calificacion,
      encuesta.pregunta1?.pregunta || '',
      encuesta.pregunta1?.respuesta || '',
      encuesta.pregunta2?.pregunta || '',
      encuesta.pregunta2?.respuesta || '',
      encuesta.pregunta3?.pregunta || '',
      encuesta.pregunta3?.respuesta || '',
      encuesta.pregunta4?.pregunta || '',
      encuesta.pregunta4?.respuesta || '',
      encuesta.pregunta5?.pregunta || '',
      encuesta.pregunta5?.respuesta || ''
    ]);

    // Calcular el promedio de las calificaciones
    const promedio = (this.filteredData.reduce((acc, encuesta) => acc + (encuesta.calificacion || 0), 0) / this.filteredData.length).toFixed(2);

    // Añadir el promedio al final del archivo
    data.push(['Promedio General', promedio]);

    // Combinar los encabezados con los datos
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([...header, ...data]);

    // Estilos para los encabezados
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
      fill: { fgColor: { rgb: '0000FF' } },
      alignment: { horizontal: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    // Aplicar estilos a la fila de encabezados
    const range = XLSX.utils.decode_range(ws['!ref'] || '');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cell_address]) continue;
      ws[cell_address].s = headerStyle;
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Encuestas');

    // Guardar el archivo Excel
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.guardarExcel(excelBuffer, 'Reporte_Encuestas.xlsx');
  }

  // Método para guardar el archivo Excel
  guardarExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName);
  }

  // Método para alternar el menú lateral
  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  // Método para cambiar de página
  CambioPestana(pestana: string) {
    this.router.navigate(['/' + pestana]);
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

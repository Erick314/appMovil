import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as XLSXStyle from 'xlsx-style';   // Importar xlsx-style con un alias diferente para estilos


@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.css'
})

export class SucursalComponent {
  
  @ViewChild('sidenav') sidenav?: MatSidenav;

  displayedColumns: string[] = ['idEmpresa', 'sucursal', 'puntoSatisfaccion', 'empresa', 'fecha'];

  encuestas = [
    { idEmpresa: 1, sucursal: 'Sucursal A', puntoSatisfaccion: 9, empresa: 'Empresa X', fecha: '10-01-2023' },
    { idEmpresa: 2, sucursal: 'Sucursal B', puntoSatisfaccion: 7, empresa: 'Empresa Y', fecha: '10-12-2023' },
    { idEmpresa: 3, sucursal: 'Sucursal A', puntoSatisfaccion: 8, empresa: 'Empresa X', fecha: '02-08-2023' },
    { idEmpresa: 4, sucursal: 'Sucursal C', puntoSatisfaccion: 6, empresa: 'Empresa Z', fecha: '03-08-2023' },
    { idEmpresa: 5, sucursal: 'Sucursal B', puntoSatisfaccion: 5, empresa: 'Empresa Y', fecha: '04-08-2023' },
    { idEmpresa: 6, sucursal: 'Sucursal A', puntoSatisfaccion: 10, empresa: 'Empresa X', fecha: '05-08-2023' },
    { idEmpresa: 7, sucursal: 'Sucursal C', puntoSatisfaccion: 9, empresa: 'Empresa Z', fecha: '05-08-2023' },
    { idEmpresa: 8, sucursal: 'Sucursal B', puntoSatisfaccion: 8, empresa: 'Empresa Y', fecha: '06-08-2023' },
    { idEmpresa: 9, sucursal: 'Sucursal A', puntoSatisfaccion: 7, empresa: 'Empresa X', fecha: '07-08-2023' },
    { idEmpresa: 10, sucursal: 'Sucursal C', puntoSatisfaccion: 6, empresa: 'Empresa Z', fecha: '15-08-2023' }
  ];

  filteredData = [...this.encuestas];
  searchText: string = ''; // Variable para el filtro

  constructor(private router: Router) {}

  // Método para filtrar encuestas por sucursal o empresa
  filtrarPorSucursalOEmpresa() {
    if (this.searchText) {
      this.filteredData = this.encuestas.filter(encuesta =>
        encuesta.sucursal.toLowerCase().includes(this.searchText.toLowerCase()) ||
        encuesta.empresa.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredData = [...this.encuestas];
    }
  }

  // Método para exportar los datos a Excel
  exportarExcel() {
    // Construir encabezados personalizados
    const header = [['ID', 'Sucursal', 'Satisfacción', 'Empresa', 'Fecha encuesta']];
  
    // Convertir los datos de encuestas a formato JSON para el cuerpo
    const data = this.filteredData.map(encuesta => [
      encuesta.idEmpresa,
      encuesta.sucursal,
      encuesta.puntoSatisfaccion,
      encuesta.empresa,
      encuesta.fecha
    ]);

    // Combinar los encabezados con los datos
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([...header, ...data]);

    // Estilos para los encabezados
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
      fill: { fgColor: { rgb: '0000FF' } },
      alignment: { horizontal: 'center' },
      border: {                   // Bordes
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      }
    };
    
    

    // Aplicar estilos a la fila de encabezados (primera fila)
    const range = XLSX.utils.decode_range(ws['!ref'] || '');  // Obtener el rango de celdas
    for (let C = range.s.c; C <= range.e.c; ++C) {            // Iterar sobre las columnas
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cell_address]) continue;
      ws[cell_address].s = headerStyle;                       // Aplicar estilo a la celda
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Encuestas');

    // Guardar el archivo Excel
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.guardarExcel(excelBuffer, 'Reporte_Encuestas.xlsx');
  }


  guardarExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName);
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

  // Método para calcular los promedios
  calcularPromedios() {
    const sucursales = this.filteredData.reduce((acc: any, encuesta) => {
      if (!acc[encuesta.sucursal]) {
        acc[encuesta.sucursal] = { total: 0, count: 0 };
      }
      acc[encuesta.sucursal].total += encuesta.puntoSatisfaccion;
      acc[encuesta.sucursal].count += 1;
      return acc;
    }, {});

    const promedios = Object.keys(sucursales).map(sucursal => ({
      sucursal,
      promedio: (sucursales[sucursal].total / sucursales[sucursal].count).toFixed(2)
    }));

    return promedios;
  }
}

// Tipo de archivo Excel
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';



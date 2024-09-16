import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.css'
})
export class SucursalComponent {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  displayedColumns: string[] = ['sucursal', 'idEncuesta', 'fechaEncuesta', 'nota'];

  encuestas = [
    { sucursal: 'Sucursal A', idEncuesta: 1, fechaEncuesta: '10-01-2023', nota: 9 },
    { sucursal: 'Sucursal B', idEncuesta: 2, fechaEncuesta: '10-12-2023', nota: 7 },
    { sucursal: 'Sucursal A', idEncuesta: 3, fechaEncuesta: '02-08-2023', nota: 8 },
    { sucursal: 'Sucursal C', idEncuesta: 4, fechaEncuesta: '03-08-2023', nota: 6 },
    { sucursal: 'Sucursal B', idEncuesta: 5, fechaEncuesta: '04-08-2023', nota: 5 },
    { sucursal: 'Sucursal A', idEncuesta: 6, fechaEncuesta: '05-08-2023', nota: 10 },
    { sucursal: 'Sucursal C', idEncuesta: 7, fechaEncuesta: '05-08-2023', nota: 9 },
    { sucursal: 'Sucursal B', idEncuesta: 8, fechaEncuesta: '06-08-2023', nota: 8 },
    { sucursal: 'Sucursal A', idEncuesta: 9, fechaEncuesta: '07-08-2023', nota: 7 },
    { sucursal: 'Sucursal C', idEncuesta: 10, fechaEncuesta: '10-08-2023', nota: 6 },
    { sucursal: 'Sucursal A', idEncuesta: 11, fechaEncuesta: '10-08-2023', nota: 9 }
  ];

  filteredData = [...this.encuestas];

  // Fecha seleccionada por el usuario (en formato string DD-MM-YYYY)
  selectedDate: string | null = null;

  constructor(private router: Router, private datePipe: DatePipe) {}

  // Método para filtrar encuestas por la fecha seleccionada
  filtrarPorFecha() {
    if (this.selectedDate) {
      this.filteredData = this.encuestas.filter(encuesta => encuesta.fechaEncuesta === this.selectedDate);
    } else {
      this.filteredData = [...this.encuestas];
    }
  }

  // Método para exportar los datos a Excel
  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Encuestas');
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

  //calculo totales para el excel
  calcularPromedios() {
    const sucursales = this.filteredData.reduce((acc: any, encuesta) => {
      if (!acc[encuesta.sucursal]) {
        acc[encuesta.sucursal] = { total: 0, count: 0 };
      }
      acc[encuesta.sucursal].total += encuesta.nota;
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

import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ApexOptions } from 'ng-apexcharts'; // Importación correcta para ApexCharts
import { AuthService } from '../services/auth.service';  

@Component({
  selector: 'app-informacion-periodo',
  templateUrl: './informacion-periodo.component.html',
  styleUrls: ['./informacion-periodo.component.css']
})
export class InformacionPeriodoComponent implements OnInit {

  public chartOptions: ApexOptions = {
    series: [],
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    },
    yaxis: {
      title: {
        text: 'Encuestas por mes'
      }
    }
  };

  constructor(private firebaseService: FirebaseService, private authService: AuthService) {}

  ngOnInit(): void {
    const usuarioLogueado = this.authService.getUsuarioLogueado();
    
    // Verificar si el usuario está logueado antes de acceder a sus propiedades
    if (usuarioLogueado && usuarioLogueado.idEmpresa) {
      if (usuarioLogueado.idEmpresa === 3) {
        this.firebaseService.getEncuestasPorMes().subscribe((data) => {
          this.actualizarGrafico(data);
        });
      } else {
        this.firebaseService.getEncuestasPorMesFiltrado(usuarioLogueado.idEmpresa).subscribe((data) => {
          this.actualizarGrafico(data);
        });
      }
    } else {
      console.error("No hay usuario logueado o falta el idEmpresa.");
      // Aquí puedes manejar qué hacer si no hay un usuario logueado o no tiene idEmpresa
    }
  }

  actualizarGrafico(data: any): void {
    this.chartOptions.series = [
      {
        name: 'Encuestas',
        data: [
          data.enero || 0,
          data.febrero || 0,
          data.marzo || 0,
          data.abril || 0,
          data.mayo || 0,
          data.junio || 0,
          data.julio || 0,
          data.agosto || 0,
          data.septiembre || 0,
          data.octubre || 0,
          data.noviembre || 0,
          data.diciembre || 0,
        ]
      }
    ];
  }
}

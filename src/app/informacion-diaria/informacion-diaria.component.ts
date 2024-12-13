import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-informacion-diaria',
  templateUrl: './informacion-diaria.component.html',
  styleUrls: ['./informacion-diaria.component.css']
})
export class InformacionDiariaComponent implements OnInit {

  public chartOptions: ApexOptions = {
    series: [],
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    },
    yaxis: {
      title: {
        text: 'Encuestas por día'
      }
    }
  };

  constructor(private firebaseService: FirebaseService, private authService: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token encontrado en localStorage:', token);
    } else {
      console.error('Token no encontrado en localStorage.');
    }
    const usuarioLogueado = this.authService.getUsuarioLogueado();

    if (usuarioLogueado && usuarioLogueado.idEmpresa !== null) {
      if (usuarioLogueado.idEmpresa === 3) {
        // Usamos el método que obtiene todas las encuestas por día desde la API
        this.firebaseService.getEncuestasPorDia().subscribe(
          (data) => this.actualizarGrafico(data),
          (error) => console.error('Error al obtener encuestas por día:', error)
        );
      } else {
        // Usamos el método filtrado para la empresa específica desde la API
        this.firebaseService.getEncuestasPorDiaFiltrado(usuarioLogueado.idEmpresa).subscribe(
          (data) => this.actualizarGrafico(data),
          (error) => console.error('Error al obtener encuestas filtradas por día:', error)
        );
      }
    } else {
      console.error('Error: Usuario no autenticado o idEmpresa no disponible.');
    }
  }
  actualizarGrafico(data: any): void {
    console.log('Datos recibidos para el gráfico:', data);
  
    this.chartOptions.series = [
      {
        name: 'Encuestas',
        data: [
          data.lunes || 0,
          data.martes || 0,
          data.miercoles || 0,
          data.jueves || 0,
          data.viernes || 0,
          data.sabado || 0,
          data.domingo || 0,
        ]
      }
    ];
  }
  
  
}

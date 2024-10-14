import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { ApexOptions } from 'ng-apexcharts';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  @ViewChild('sidenav') sidenav?: MatSidenav;
  usuarioLogueado: any = null;
  empresas: any[] = [];
  encuestaPorEmpresa: { [key: string]: number } = {};
  datosCargados = false;
  totalSucursales: number = 0;
  totalEncuestas: number = 0;
  promedioCalificaciones: number = 0;

  //Este apartado podemos editarlo y cambiar varias configuraciones del gráfico, 
  public chartOptions: ApexOptions = {
    series: [],
    chart: {
      type: 'bar',
      height: 350,
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: {
        text: 'Encuestas contestadas'
      }
    }
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.getUsuarioLogueado();
    if (this.usuarioLogueado) {
      this.cargarDatos();
    } else {
      console.error("probando data para las card");
    }
  }

  cargarDatos() {
    if (this.datosCargados) {
      return;
    }
    this.datosCargados = true;
  
    // Obtener las empresas y cargar el gráfico para todas las empresas
    this.firebaseService.getEmpresas().pipe(take(1)).subscribe((empresas: any[]) => {
      this.empresas = empresas;
      this.cargarEncuestas(); // Cargar encuestas para todas las empresas
      console.log('Empresas (todas):', empresas);  
    });
  
    if (this.usuarioLogueado?.idEmpresa === 3) {
      // Obtener todas las sucursales y encuestas para idEmpresa = 3
      this.firebaseService.getSucursales().pipe(take(1)).subscribe((sucursales: any[]) => {
        this.totalSucursales = sucursales.length;
        console.log('Sucursales (todas):', sucursales);
      });
  
      this.firebaseService.getEncuestas().pipe(take(1)).subscribe((encuestas: any[]) => {
        this.totalEncuestas = encuestas.length;
        this.calcularPromedioCalificaciones(encuestas);
        console.log('Encuestas (todas):', encuestas);
      });
    } else {
      // Para usuarios diferentes de idEmpresa = 3
      this.firebaseService.getSucursalesFiltrado(this.usuarioLogueado.idEmpresa).pipe(take(1)).subscribe((sucursales: any[]) => {
        this.totalSucursales = sucursales.length;
        console.log('Sucursales filtradas:', sucursales);
      });
  
      this.firebaseService.getEncuestasFiltrado(this.usuarioLogueado.idEmpresa).pipe(take(1)).subscribe((encuestas: any[]) => {
        this.totalEncuestas = encuestas.length;
        this.calcularPromedioCalificaciones(encuestas);
        console.log('Encuestas filtradas:', encuestas);
      });
    }
  }
  
  calcularPromedioCalificaciones(encuestas: any[]): void {
    const sumaCalificaciones = encuestas.reduce((sum, encuesta) => sum + (encuesta.calificacion || 0), 0);
    this.promedioCalificaciones = encuestas.length ? (sumaCalificaciones / encuestas.length) : 0;
  }

  cargarEncuestas() {
    this.encuestaPorEmpresa = {}; 

    this.firebaseService.getEncuestas().subscribe((encuestas: any[]) => {
      encuestas.forEach(encuesta => {
        const empresaId = encuesta.empresa;
        if (this.encuestaPorEmpresa[empresaId]) {
          this.encuestaPorEmpresa[empresaId]++;
        } else {
          this.encuestaPorEmpresa[empresaId] = 1;
        }
      });

      if (this.empresas.length > 0) {
        this.actualizarGrafico();
      }
    });
  }

  actualizarGrafico() {
    if (this.empresas.length === 0) {
      return;
    }
    this.chartOptions.series = [];

    // Muestra las encuestas para todas las empresas
    const empresasNombres = this.empresas.map(empresa => empresa.nombreEmpresa);
    const encuestasPorEmpresa = this.empresas.map(empresa => this.encuestaPorEmpresa[empresa.idEmpresa] || 0);
  
    this.chartOptions.xaxis = {
      categories: empresasNombres
    };
  
    this.chartOptions.series = [
      {
        name: 'Encuestas',
        data: encuestasPorEmpresa
      }
    ];
  }
  

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  CambioPestana(pestaña: string) {
    this.router.navigate([pestaña]);
    
  }
}


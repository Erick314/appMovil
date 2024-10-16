import { Component, ViewChild, OnInit, AfterViewChecked } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { ApexOptions, ChartComponent } from 'ng-apexcharts';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit, AfterViewChecked {
  @ViewChild('sidenav') sidenav?: MatSidenav;
  @ViewChild('chart') chart?: ChartComponent; // Referencia al gráfico para forzar actualización
  usuarioLogueado: any = null;
  empresas: any[] = [];
  encuestaPorEmpresa: { [key: string]: number } = {};
  datosCargados = false;
  totalSucursales: number = 0;
  totalEncuestas: number = 0;
  promedioCalificaciones: number = 0;

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
    }
  }

  ngAfterViewChecked(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('resize')); // Forzar ajuste del gráfico
    }
  }
  

  cargarDatos() {
    if (this.datosCargados) {
      return;
    }
    this.datosCargados = true;

    this.firebaseService.getEmpresas().pipe(take(1)).subscribe((empresas: any[]) => {
      this.empresas = empresas;
      this.cargarEncuestas();
    });

    if (this.usuarioLogueado?.idEmpresa === 3) {
      this.firebaseService.getSucursales().pipe(take(1)).subscribe((sucursales: any[]) => {
        this.totalSucursales = sucursales.length;
      });

      this.firebaseService.getEncuestas().pipe(take(1)).subscribe((encuestas: any[]) => {
        this.totalEncuestas = encuestas.length;
        this.calcularPromedioCalificaciones(encuestas);
      });
    } else {
      this.firebaseService.getSucursalesFiltrado(this.usuarioLogueado.idEmpresa).pipe(take(1)).subscribe((sucursales: any[]) => {
        this.totalSucursales = sucursales.length;
      });

      this.firebaseService.getEncuestasFiltrado(this.usuarioLogueado.idEmpresa).pipe(take(1)).subscribe((encuestas: any[]) => {
        this.totalEncuestas = encuestas.length;
        this.calcularPromedioCalificaciones(encuestas);
      });
    }
  }

  calcularPromedioCalificaciones(encuestas: any[]): void {
    const sumaCalificaciones = encuestas.reduce((sum, encuesta) => sum + (encuesta.calificacion || 0), 0);
    this.promedioCalificaciones = encuestas.length ? (sumaCalificaciones / encuestas.length) : 0;
  }

  cargarEncuestas() {
    this.encuestaPorEmpresa = {};

    this.firebaseService.getEncuestas().pipe(take(1)).subscribe((encuestas: any[]) => {
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
    this.chartOptions.xaxis = { categories: [] };

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
    console.log("Cerrando sesión...");
    this.authService.logout().then(() => {
      console.log("Sesión cerrada correctamente.");
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error("Error al cerrar sesión: ", error);
    });
  }
  
  

  CambioPestana(pestaña: string) {
    this.router.navigate([pestaña]);
    if (this.chart) {
      this.chart.updateOptions(this.chartOptions, true, true); // Forzar redibujado cuando cambias de pestaña
    }
  }
}

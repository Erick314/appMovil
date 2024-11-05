import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { SplashComponent } from './splash/splash.component';
import { PrincipalComponent } from './principal/principal.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { AdminComponent } from './admin/admin.component';   
import { EmpresaComponent } from './empresa/empresa.component';   
import { CrearusuarioComponent } from './crearusuario/crearusuario.component'; 
import { SucursalComponent } from './sucursal/sucursal.component';   
import { EncuestaFinalizadaComponent } from './encuesta-finalizada/encuesta-finalizada.component';
import { PreguntaComponent } from './pregunta/pregunta.component';
import { ReporteEncuestaComponent } from './reporte-encuesta/reporte-encuesta.component';
import { InformacionDiariaComponent } from './informacion-diaria/informacion-diaria.component';
import { InformacionPeriodoComponent } from './informacion-periodo/informacion-periodo.component'; 
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { SucursalModule } from './sucursal/sucursal.module';



const routes: Routes = [
  { path: '', component: SplashComponent },  
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'encuesta', component: EncuestaComponent , canActivate: [AuthGuard]},
  {path: 'principal', component: PrincipalComponent,
    children: [
      { path: '', redirectTo: 'informacion-diaria', pathMatch: 'full' },  
      { path: 'informacion-diaria', component: InformacionDiariaComponent, canActivate: [AuthGuard] },
      { path: 'informacion-periodo', component: InformacionPeriodoComponent , canActivate: [AuthGuard]},
    ]
  },  
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'admin', component: AdminComponent , canActivate: [AuthGuard]},
  { path: 'empresa', component: EmpresaComponent, canActivate: [AuthGuard] },
  { path: 'crear', component: CrearusuarioComponent },
  { path: 'sucursal', loadChildren: () => import('./sucursal/sucursal.module').then(m => m.SucursalModule), canActivate: [AuthGuard] },
  { path: 'pregunta', component: PreguntaComponent },
  { path: 'reporte-encuesta', component: ReporteEncuestaComponent, canActivate: [AuthGuard] },
  { path: 'encuesta-finalizada', component: EncuestaFinalizadaComponent },
  { path: 'not-found', component: NotFoundComponent }, 
  { path: '**', redirectTo: 'login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes), SucursalModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}

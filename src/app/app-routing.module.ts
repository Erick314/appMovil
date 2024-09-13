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
import { CrearComponent } from './crear/crear.component';  

const routes: Routes = [
  { path: '', component: SplashComponent },  
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'encuesta', component: EncuestaComponent },
  { path: 'principal', component: PrincipalComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'empresa', component: EmpresaComponent },
  { path: 'crear', component: CrearComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

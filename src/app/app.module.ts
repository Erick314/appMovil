import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatCardModule } from '@angular/material/card'; 
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { SplashComponent } from './splash/splash.component';
import { DatePipe } from '@angular/common'; 


//Principal
import { HomeComponent } from './home/home.component';
import { PrincipalComponent } from './principal/principal.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { InicioComponent } from './inicio/inicio.component';
import { AdminComponent } from './admin/admin.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { AgradecimientoDialogComponent } from './agradecimiento-dialog/agradecimiento-dialog.component';
import { SucursalComponent } from './sucursal/sucursal.component';
import { CrearComponent } from './crear/crear.component'; 
import { EncuestaComponent } from './encuesta/encuesta.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    EncuestaComponent,
    PrincipalComponent,
    SplashComponent,
    RecuperarComponent,
    InicioComponent,
    AdminComponent,
    EmpresaComponent,
    AgradecimientoDialogComponent,
    CrearComponent,
    SucursalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule, 
    MatCardModule, 
    FormsModule,
    CommonModule,
    MatTableModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    DatePipe

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

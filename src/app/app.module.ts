import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './login/login.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatCardModule } from '@angular/material/card'; 
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';



//login
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HomeComponent } from './home/home.component';

//home
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { EncuestaComponent } from './encuesta/encuesta.component';

//Encuesta
import { MatMenuModule } from '@angular/material/menu';
import { SplashComponent } from './splash/splash.component';
import { CrearComponent } from './crear/crear.component';  


//Principal
import { PrincipalComponent } from './principal/principal.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { InicioComponent } from './inicio/inicio.component';
import { AdminComponent } from './admin/admin.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { AgradecimientoDialogComponent } from './agradecimiento-dialog/agradecimiento-dialog.component';

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
    CrearComponent
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
    MatTableModule
  ],
  providers: [provideClientHydration(), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}

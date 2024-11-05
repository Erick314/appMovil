import { NgModule, isDevMode } from '@angular/core';
import {BrowserModule,provideClientHydration} from '@angular/platform-browser';

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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { NgApexchartsModule } from 'ng-apexcharts';


//Principal
import { HomeComponent } from './home/home.component';
import { PrincipalComponent } from './principal/principal.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { InicioComponent } from './inicio/inicio.component';
import { AdminComponent } from './admin/admin.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { AgradecimientoDialogComponent } from './agradecimiento-dialog/agradecimiento-dialog.component';
import { SucursalComponent } from './sucursal/sucursal.component';
import { CrearusuarioComponent } from './crearusuario/crearusuario.component'; 
import { EncuestaComponent } from './encuesta/encuesta.component';
import { LoginComponent } from './login/login.component';
import { EncuestaFinalizadaComponent } from './encuesta-finalizada/encuesta-finalizada.component';
import { PreguntaComponent } from './pregunta/pregunta.component';
import { PreguntaModalComponent } from './pregunta-modal/pregunta-modal.component';
import { AsignarPreguntaSucursalComponent } from './asignar-pregunta-sucursal/asignar-pregunta-sucursal.component';
import { environment } from '../environments/environment'; 
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ReporteEncuestaComponent } from './reporte-encuesta/reporte-encuesta.component';
import { InformacionDiariaComponent } from './informacion-diaria/informacion-diaria.component';
import { InformacionPeriodoComponent } from './informacion-periodo/informacion-periodo.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthGuard } from './guards/auth.guard';
import { EditEmpresaDialogComponent } from './edit-empresa-dialog/edit-empresa-dialog.component';





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
    CrearusuarioComponent,
    SucursalComponent,
    EncuestaFinalizadaComponent,
    PreguntaComponent,
    PreguntaModalComponent,
    AsignarPreguntaSucursalComponent,
    ReporteEncuestaComponent,
    InformacionDiariaComponent,
    InformacionPeriodoComponent,
    NotFoundComponent,
    EditEmpresaDialogComponent
  ],
  imports: [
    BrowserModule,
    MatRadioModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    NgApexchartsModule,
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
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase), // Inicializar Firebase con configuración de environment
    AngularFirestoreModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
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

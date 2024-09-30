import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service'; 
import { first } from 'rxjs/operators'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
})
export class LoginComponent {
  loginForm: FormGroup;
  private splashShown = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,  // Usa AuthService para manejar la autenticación
    private firebaseService: FirebaseService
  ) {
    this.initializeApp();
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    });
  }

  initializeApp() {
    if (!this.splashShown) {
      this.splashShown = true;
      this.router.navigateByUrl('splash');
    }
  }

  // Método para validar el inicio de sesión
  onSubmit() {
    if (this.loginForm.valid) {
      const { usuario, password } = this.loginForm.value;

      this.authService.loginPorNombre(usuario, password).then((credenciales) => {
        if (credenciales) {
          // Ingresar con autenticación
          if (this.authService.getUsuarioLogueado().tipoUsuario === 'Empresa' || this.authService.getUsuarioLogueado().tipoUsuario === 'SuperAdmin') {
            this.router.navigate(['/principal']);
          } else if (this.authService.getUsuarioLogueado().tipoUsuario === 'Cliente') {
            alert('Ingreso Exitoso como Cliente!');
            this.router.navigate(['/encuesta']);
          }
        } else {
          // Acceso sin autenticación
          alert('Se ingresa sin autenticarse.');
          this.router.navigate(['/principal']);  // Permitir el acceso al sistema
        }
      }).catch(error => {
        alert(error);
      });
    }
  }

  recuperar() {
    this.router.navigate(['/recuperar']);
  }

  crearUsuario() {
    this.router.navigate(['/crear']);
  }
}

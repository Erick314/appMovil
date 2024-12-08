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
  
      this.authService.loginPorNombre(usuario, password).then((response) => {
        const usuarioLogueado = this.authService.getUsuarioLogueado();
  
        if (usuarioLogueado) {
          console.log('Tipo de usuario logueado:', usuarioLogueado.tipoUsuario);
  
          // Redirigir según el tipo de usuario
          if (usuarioLogueado.tipoUsuario === 'Empresa' || usuarioLogueado.tipoUsuario === 'SuperAdmin') {
            this.router.navigate(['/principal']);
          } else if (usuarioLogueado.tipoUsuario === 'Cliente') {
            this.router.navigate(['/encuesta']);
          } else {
            this.router.navigate(['/login']);
          }
        }
      }).catch(error => {
        alert('Error al iniciar sesión: ' + error.message);
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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service'; // Importa el servicio de Firebase
import { first } from 'rxjs/operators'; // Importa el operador 'first' para obtener el primer resultado

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corrección de 'styleUrl' a 'styleUrls'
})
export class LoginComponent {
  loginForm: FormGroup;
  private splashShown = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebaseService: FirebaseService // Inyecta el servicio de Firebase
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

      // Busca el usuario en Firebase por nombre
      this.firebaseService.getUsuarioByNombre(usuario).pipe(first()).subscribe((usuarios) => {
        if (usuarios.length > 0) {
          const usuarioEncontrado = usuarios[0];

          if (usuarioEncontrado.password === password) {
            // Validar el tipo de usuario
            if (usuarioEncontrado.tipoUsuario === 'Empresa') {
              this.router.navigate(['/principal']); // Redirigir al menú de admin
            } else if (usuarioEncontrado.tipoUsuario === 'Cliente') {
              alert('Ingreso Exitoso! ' + usuario);
              this.router.navigate(['/encuesta']); // Redirigir al menú de cliente
            } else {
              alert('Tipo de usuario no reconocido.');
            }
          } else {
            alert('Contraseña incorrecta');
          }
        } else {
          alert('Usuario no encontrado');
        }
      });
    }
  }

  // Método para redirigir a la página de recuperación de contraseña
  recuperar() {
    this.router.navigate(['/recuperar']);
  }

  // Método para redirigir a la página de creación de usuario
  crearUsuario() {
    this.router.navigate(['/crear']);
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service'; // Servicio para acceder a Firestore
import { first } from 'rxjs/operators'; // Importamos first() para tomar solo el primer valor

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent {
  forgotPasswordForm: FormGroup;
  submitted = false;
  message: string | null = null;
  usuarioExiste = false;
  isCodigoValidado = false;

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService) {
    this.forgotPasswordForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      codigoEmpresa: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  get usuario() {
    return this.forgotPasswordForm.get('usuario');
  }

  get codigoEmpresa() {
    return this.forgotPasswordForm.get('codigoEmpresa');
  }

  get password() {
    return this.forgotPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.forgotPasswordForm.get('confirmPassword');
  }

  // Validar si el usuario existe en la base de datos
  onSubmit() {
    this.submitted = true;
    
    if (this.forgotPasswordForm.get('usuario')?.invalid) {
      return;
    }

    // Verificar si el usuario existe en Firestore
    this.firebaseService.getUsuarioByNombre(this.usuario?.value)
      .pipe(first()) // Usamos first para tomar el primer valor y desuscribirnos
      .subscribe(usuarioSnapshot => {
        if (usuarioSnapshot.length > 0) {
          this.usuarioExiste = true;
          this.message = 'Usuario encontrado. Ahora valide su código de empresa.';
        } else {
          this.message = 'El usuario no existe.';
          this.usuarioExiste = false;
        }
      }, error => {
        console.error('Error al buscar el usuario:', error);
        this.message = 'Hubo un error al buscar el usuario.';
      });
  }

  // Validar el código de empresa
  validarCodigoEmpresa() {
    const codigo = this.forgotPasswordForm.get('codigoEmpresa')?.value;

    this.firebaseService.getUsuarioByCodigoEmpresa(codigo)
      .pipe(first()) // Usamos first para tomar el primer valor y desuscribirnos
      .subscribe(empresaSnapshot => {
        if (empresaSnapshot.length > 0) {
          this.isCodigoValidado = true;
          this.message = 'Código de empresa validado. Ahora puede restablecer su contraseña.';
        } else {
          this.message = 'Código de empresa no válido.';
          this.isCodigoValidado = false;
        }
      }, error => {
        console.error('Error al validar el código de empresa:', error);
        this.message = 'Hubo un error al validar el código de empresa.';
      });
  }

  // Restablecer la contraseña
  onRestablecerContrasena() {
    this.submitted = true;
  
    if (this.forgotPasswordForm.invalid || this.password?.value !== this.confirmPassword?.value) {
      this.message = 'Por favor, asegúrese de que las contraseñas coincidan.';
      return;
    }
  
    const nuevaContrasena = this.password?.value;
    const usuario = this.usuario?.value;
  
    // Usamos subscribe para manejar el observable en lugar de then y catch
    this.firebaseService.actualizarContraseña(usuario, nuevaContrasena).subscribe({
      next: () => {
        this.message = 'Contraseña actualizada exitosamente.';
        this.forgotPasswordForm.reset();
        this.submitted = false;
      },
      error: (error: any) => {
        console.error('Error al actualizar la contraseña:', error);
        this.message = 'Hubo un error al actualizar la contraseña.';
      }
    });
  }
  
}

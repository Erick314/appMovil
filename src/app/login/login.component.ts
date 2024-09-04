import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4),Validators.pattern('^[0-9]+$')]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { usuario, password } = this.loginForm.value;

      if (usuario === 'Juancho' && password === '1331') {
        alert('Ingreso Exitoso!');
        this.router.navigate(['/home']);
      } else if (usuario === 'cliente' && password === '1234'){
        alert('Ingreso Exitoso!');
        this.router.navigate(['/encuesta']);
      } else if (usuario === 'cliente2' && password === '1122'){
        alert('Ingreso Exitoso!');
        this.router.navigate(['/principal']);
      } 
      else {
        alert('Correo y/o contraseña incorrectos');
      }

    }
  } 
  
}

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
  private splashShown = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.initializeApp();
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4),Validators.pattern('^[0-9]+$')]],
    });
  }
  
  initializeApp() {
    if (!this.splashShown) {
      this.splashShown = true;
      this.router.navigateByUrl('splash');
    }
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
      } else if (usuario === 'admin' && password === '1234'){
        alert('Ingreso Exitoso!');
        this.router.navigate(['/principal']);
      } 
      else {
        alert('Correo y/o contraseña incorrectos');
      }

    }
  }
  
  recuperar() {
    
    this.router.navigate(['/recuperar']);
  }
  
}

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Aquí iría la lógica para autenticar al usuario
      const { email, password } = this.loginForm.value;

      // Simulación de autenticación simple
      if (email === 'user@example.com' && password === 'password123') {
        alert('Login successful!');
        this.router.navigate(['/']);
      } else {
        alert('Invalid email or password');
      }
    }
  }
}

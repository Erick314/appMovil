import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent {
  forgotPasswordForm: FormGroup;
  submitted = false;
  message: string | null = null;

  constructor(private formBuilder: FormBuilder) {

    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    // Simulación de envío de correo de recuperación, luego incorporaremos lógica de  firebase para recuperar de verdad
    const email = this.email?.value;
    this.message = `Correo de recuperación enviado con éxito a ${email}`;

    // limpia el formulario después de mostrar el mensaje
    this.forgotPasswordForm.reset();
    this.submitted = false;
  }
}

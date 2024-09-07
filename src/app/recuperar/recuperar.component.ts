import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})

export class RecuperarComponent implements OnInit {
  forgotPasswordForm: FormGroup = new FormGroup({}); // Inicialización vacía
  submitted = false;
  message = '';

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Getter para facilitar acceso a los controles del formulario
  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit(): void {
    this.submitted = true;

    // Si el formulario es inválido, no hacemos nada
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    // Aquí realizarías la lógica para enviar la solicitud de recuperación
    // como una llamada a tu servicio, etc.
    const email = this.forgotPasswordForm.value.email;
    this.message = `Se ha enviado un correo de recuperación a ${email}.`;
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {
  crearForm: FormGroup;
  submitted = false;
  message: string | null = null;

  constructor(private formBuilder: FormBuilder) { 
    this.crearForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.crearForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.crearForm.invalid) {
      return;
    }

    const nombre = this.crearForm.value.nombre;
    this.message = `Usuario creado exitosamente: ${nombre}`;
  }
}

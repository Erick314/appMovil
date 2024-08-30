import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  infoForm: FormGroup;
  username = 'user@example.com'; // Este valor debería ser pasado desde el servicio de autenticación
  nivelesEducacion = [
    'Básica',
    'Media',
    'Universitaria',
    'Técnico',
    'Doctorado',
  ];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.infoForm = this.fb.group({
      nombre: [''],
      apellido: [''],
      educacion: [''],
      fechaNacimiento: [''],
    });
  }

  ngOnInit(): void {}

  onClear() {
    this.infoForm.reset();
  }

  onShow() {
    const { nombre, apellido, educacion, fechaNacimiento} = this.infoForm.value;
    this.snackBar.open(`Nombre: ${nombre}, Apellido: ${apellido}, Educación: ${educacion}, Fecha de Nacimiento: ${fechaNacimiento}`, 'Close', {
      duration: 5000,
    });
  }
}

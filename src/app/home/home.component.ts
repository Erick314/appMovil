import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {
  infoForm: FormGroup;
  username = 'Juanitox'; 
  nivelesEducacion = [
    'Básica',
    'Media',
    'Universitaria',
    'Técnico',
    'Doctorado',
  ];

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
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
    const formattedDate = this.datePipe.transform(fechaNacimiento, 'dd/MM/yyyy');

    alert(`Nombre: ${nombre}\nApellido: ${apellido}\nEducación: ${educacion}\nFecha de Nacimiento: ${formattedDate}`);
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service'; // Importa el servicio de Firebase
import { Router } from '@angular/router'; // Importa el Router para la redirección

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {
  crearForm: FormGroup;
  submitted = false;
  message: string | null = null;
  empresaValida = false;
  codigoInvalido = false; // Nueva propiedad para manejar el estado de error
  empresaSeleccionada: any = null; // Para almacenar la empresa seleccionada

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private router: Router) { 
    this.crearForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      codigo: ['', [Validators.required, Validators.minLength(8)]],
      tipoUsuario: ['', Validators.required], // Campo para tipo de usuario
      sucursal: [''] // Campo vacío para cuando se necesite en el caso de cliente
    });
  }

  // Acceso rápido a los controles del formulario
  get f() {
    return this.crearForm.controls;
  }

  // Método para verificar el tipo de usuario seleccionado
  onTipoUsuarioChange(event: Event) {
    this.empresaValida = false;
    this.codigoInvalido = false; // Reiniciar estado de error
    this.empresaSeleccionada = null; // Reiniciar empresa seleccionada

    const tipoUsuario = (event.target as HTMLSelectElement).value;
    if (tipoUsuario === 'Empresa') {
      this.f['codigo'].setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      this.f['codigo'].clearValidators();
    }
    this.f['codigo'].updateValueAndValidity();
  }

  // Método para validar el código de la empresa
  validarCodigoEmpresa() {
    const codigo = this.f['codigo'].value;
    this.firebaseService.validarCodigoEmpresa(codigo).subscribe((empresas) => {
      if (empresas.length > 0) {
        this.empresaValida = true;
        this.codigoInvalido = false; // Código válido, ocultar el error
        this.empresaSeleccionada = empresas[0]; // Almacenar la empresa encontrada
      } else {
        this.empresaValida = false;
        this.codigoInvalido = true; // Mostrar mensaje de error
        this.empresaSeleccionada = null; // No hay empresa seleccionada
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.crearForm.invalid) {
      return;
    }

    const nombre = this.f['nombre'].value;
    const email = this.f['email'].value;
    const password = this.f['password'].value;
    const tipoUsuario = this.f['tipoUsuario'].value;

    const nuevoUsuario = {
      nombre: nombre,
      email: email,
      password: password,
      codigoEmpresa: this.empresaSeleccionada ? this.empresaSeleccionada.codigoEmpresa : null,
      idEmpresa: this.empresaSeleccionada ? this.empresaSeleccionada.idEmpresa : null,
      tipoUsuario: tipoUsuario,
      sucursal: tipoUsuario === 'Cliente' ? 'no aplica' : null,
      vigencia: 1 // Asignar vigencia como 1 (o true) por defecto
    };

    // Guardar el usuario en Firebase
    this.firebaseService.addUsuario(nuevoUsuario).then(() => {
      this.message = `Usuario creado exitosamente: ${nombre}`;
      this.limpiarCampos(); // Limpiar los campos del formulario después de agregar
      setTimeout(() => {
        this.router.navigate(['/login']); // Redirigir al login después de la creación exitosa
      }, 3000); // Espera de 3 segundos antes de redirigir
    }).catch(error => {
      console.error('Error al crear usuario: ', error);
    });
  }

  // Método para limpiar los campos del formulario después de agregar un usuario
  limpiarCampos() {
    this.crearForm.reset();
    this.submitted = false;
    this.empresaValida = false;
    this.codigoInvalido = false;
    this.empresaSeleccionada = null;
    this.message = null;
  }
}

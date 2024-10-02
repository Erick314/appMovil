import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  // Método para agregar una nueva empresa
  addEmpresa(empresa: any): Promise<any> {
    return this.firestore.collection('empresas').add(empresa);
  }

  // Método para obtener todas las empresas
  getEmpresas(): Observable<any[]> {
    return this.firestore.collection('empresas').valueChanges({ idField: 'id' });
  }

  getSucursalesByEmpresa(idEmpresa: number): Observable<any[]> {
    return this.firestore.collection('sucursales', ref => ref.where('empresa', '==', idEmpresa)).valueChanges();
  }
  
  
  addSucursal(sucursalData: any) {
    const usuarioLogueado = this.authService.getUsuarioLogueado();
    console.log('Usuario logueado:', usuarioLogueado);
  
    if (usuarioLogueado && usuarioLogueado.idEmpresa) {
      const sucursal = {
        ...sucursalData,
        empresa: usuarioLogueado.idEmpresa || 'Sin Empresa',
        vigencia: 'Vigente',
        fechaCreacion: this.getFormattedDate()
      };
      console.log('Sucursal a guardar:', sucursal);
  
      return this.firestore.collection('sucursales').add(sucursal);
    } else {
      return Promise.reject('Usuario no autenticado o sin empresa asociada');
    }
  }
  
  getSucursales() {
    return this.firestore.collection('sucursales').valueChanges();
  }
    // Método para validar si el código de empresa existe
  validarCodigoEmpresa(codigo: string): Observable<any> {
    return this.firestore.collection('empresas', ref => ref.where('codigoEmpresa', '==', codigo)).valueChanges();
  }
    // Método para agregar un nuevo usuario
  addUsuario(usuario: any): Promise<any> {
    return this.firestore.collection('usuarios').add(usuario);
  }
  //metodo para validar el login
  getUsuarioByNombre(nombre: string): Observable<any[]> {
    return this.firestore.collection('usuarios', ref => ref.where('nombre', '==', nombre)).valueChanges();
  }


  getFormattedDate(): string {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }
}

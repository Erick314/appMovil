import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) {}

  // Método para agregar una nueva empresa
  addEmpresa(empresa: any): Promise<any> {
    return this.firestore.collection('empresas').add(empresa);
  }

  // Método para obtener todas las empresas
  getEmpresas(): Observable<any[]> {
    return this.firestore.collection('empresas').valueChanges({ idField: 'id' });
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
}

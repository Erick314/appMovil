import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 
import { from } from 'rxjs'; 
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';





@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, private authService: AuthService,private afAuth: AngularFireAuth) {}

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
  getAsignaciones(): Observable<any[]> {
    return this.firestore.collection('asignaciones').valueChanges();
  }
  getAsignacionesByEmpresa(nombreSucursal: string): Observable<any[]> {
    return this.firestore.collection('asignaciones', ref => ref.where('sucursal', '==', nombreSucursal)).valueChanges();
  }
  generateUniqueId(): string {
    return this.firestore.createId();  // Genera un ID único para Firebase
  }
  addAsignacion(asignacion: any): Promise<any> {
    return this.firestore.collection('asignaciones').doc(asignacion.idSucursalPregunta).set(asignacion);
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
  getSucursalesEmpresa() {
    const usuarioLogueado = this.authService.getUsuarioLogueado();
    if (usuarioLogueado.tipoUsuario === 'SuperAdmin') {
      // Si es SuperAdmin, obtenemos todas las sucursales
      return this.firestore.collection('sucursales').valueChanges();
    } else {
      // Si es usuario de empresa, obtenemos solo las sucursales asociadas a su empresa
      return this.firestore.collection('sucursales', ref => ref.where('empresa', '==', usuarioLogueado.idEmpresa)).valueChanges();
    }
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
  getUsuarioByCodigoEmpresa(codigo: string){
    return this.firestore.collection('empresas', ref => ref.where('codigoEmpresa', '==', codigo)).valueChanges();
  }

  enviarCorreoRestablecimiento(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }
  
 
  getFormattedDate(): string {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  addPregunta(pregunta: any): Promise<any> {
    const usuarioLogueado = this.authService.getUsuarioLogueado();
    
    if (usuarioLogueado && usuarioLogueado.idEmpresa) {
      const preguntaData = {
        ...pregunta,
        empresa: usuarioLogueado.idEmpresa, // Capturar la empresa del usuario logueado
        fechaCreacion: this.getFormattedDate() // Fecha actual
      };
      return this.firestore.collection('preguntas').add(preguntaData); // Guardar en Firestore
    } else {
      return Promise.reject('Usuario no autenticado o sin empresa asociada');
    }
  }
  getPreguntasAsignadasPorSucursal(nombreSucursal: string): Observable<any[]> {
    return this.firestore.collection('asignaciones', ref => ref.where('nombreSucursal', '==', nombreSucursal)).valueChanges();
  }
  
  // Método para obtener todas las preguntas
  getPreguntas(): Observable<any[]> {
    return this.firestore.collection('preguntas').valueChanges();
  }
  getPreguntaPorId(idPregunta: string): Observable<any> {
    return this.firestore.collection('preguntas').doc(idPregunta).valueChanges();
  }
  getPreguntasPorEmpresa(idEmpresa: number): Observable<any[]> {
    return this.firestore.collection('preguntas', ref => ref.where('empresa', '==', idEmpresa)).valueChanges();
  }
  guardarEncuesta(respuestasEncuesta: any): Promise<any> {
    return this.firestore.collection('encuestas').add(respuestasEncuesta);
}

  guardarRespuesta(encuestaId: string, respuesta: any) {
    return this.firestore.collection(`encuestas/${encuestaId}/respuestasPreguntas`).add(respuesta);
  }
  getPreguntasByEmpresa(idEmpresa: number): Observable<any[]> {
    return this.firestore.collection('preguntas', ref => ref.where('empresa', '==', idEmpresa)).valueChanges();
  }
  getEncuestas(): Observable<any[]> {
    return this.firestore.collection('encuestas').valueChanges();
  }


}

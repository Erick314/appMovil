import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioLogueado: any = null; // Almacena los datos del usuario autenticado
  private alertaMostrada: number = 0;  // Contador para las veces que se muestra la alerta
  private maxAlertas: number = 2;      // Número máximo de veces que se puede mostrar la alerta

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  loginPorNombre(nombre: string, password: string): Promise<firebase.auth.UserCredential | null> {
    return new Promise((resolve, reject) => {
      this.firestore.collection<any>('usuarios', ref => ref.where('nombre', '==', nombre))
        .valueChanges({ idField: 'id' })
        .subscribe({
          next: (usuarios) => {
            if (usuarios.length > 0) {
              const usuario = usuarios[0]; 
              const email = usuario.email;
              
              if (email) {
                this.afAuth.signInWithEmailAndPassword(email, password)
                  .then(credenciales => {
                    this.usuarioLogueado = usuario;
                    resolve(credenciales);
                  })
                  .catch(error => {
                    if (error.code === 'auth/quota-exceeded') {
                      if (this.alertaMostrada < this.maxAlertas) {
                        console.warn('Autenticación no disponible: acceso sin autenticación.');
                        alert('Se ingresa sin autentificarse, ya que la cuota ha sido excedida.');
                        this.alertaMostrada++;  // Incrementar el contador de alertas
                      }
                      this.usuarioLogueado = usuario; // Almacenar usuario aunque no se autentifique
                      resolve(null);  // No devolver credenciales pero continuar el flujo
                    } else {
                      reject('Error de autenticación: ' + error.message);
                    }
                  });
              } else {
                reject('No se encontró el email para el usuario');
              }
            } else {
              reject('Usuario no encontrado');
            }
          },
          error: (err) => {
            reject('Error obteniendo usuarios: ' + err.message);
          }
        });
    });
  }
  
  // Método para obtener los datos del usuario logueado
  getUsuarioLogueado(): any {
    return this.usuarioLogueado;
  }

  logout(): Promise<void> {
    this.usuarioLogueado = null;
    this.alertaMostrada = 0;  // Reiniciar contador al cerrar sesión
    return this.afAuth.signOut();
  }

  getLoggedInUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }
}

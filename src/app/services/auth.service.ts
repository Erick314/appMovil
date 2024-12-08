import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // URL base de la API
  private usuarioLogueado: any = null; 

  constructor(private http: HttpClient,private afAuth: AngularFireAuth) {}

  // Método modificado para realizar login y obtener el token
  loginPorNombre(nombre: string, password: string): Promise<any> {
    const body = { username: nombre, password: password };
    return this.http.post<any>(`${this.apiUrl}/login`, body).toPromise().then(response => {
      if (response && response.token && response.usuario) {
        localStorage.setItem('token', response.token); // Guarda el token
        localStorage.setItem('idEmpresa', response.usuario.idEmpresa); // Guarda idEmpresa
        localStorage.setItem('tipoUsuario', response.usuario.tipoUsuario); // Guarda tipoUsuario
        this.usuarioLogueado = response.usuario; // Guarda el usuario logueado en memoria
        return response;
      } else {
        throw new Error('Error en la autenticación: Datos incompletos');
      }
    }).catch(error => {
      throw new Error('Error al iniciar sesión: ' + error.message);
    });
  }
  
  

  sincronizarUsuario(): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject('Token no encontrado');
    }
    return this.http.get<any>(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).toPromise().then(usuario => {
      this.usuarioLogueado = usuario;
      return usuario;
    });
  }
  

  enviarCorreoRestablecimiento(email: string): Promise<void> {
    return Promise.resolve(); // Reemplaza con tu lógica
  }
  
  // Método para obtener los datos del usuario logueado
  getUsuarioLogueado(): any {
    if (!this.usuarioLogueado) {
      this.usuarioLogueado = {
        idEmpresa: localStorage.getItem('idEmpresa'),
        tipoUsuario: localStorage.getItem('tipoUsuario'),
      };
    }
    return this.usuarioLogueado;
  }
  
  

  // Método para cerrar sesión
  
  logout(): Promise<void> {
    localStorage.removeItem('token'); // Eliminar el token del localStorage
    this.usuarioLogueado = null; // Limpiar el usuario logueado
    return Promise.resolve(); // Devolver una promesa resuelta (útil para encadenar)
  }
  
  registrarUsuario(email: string, password: string): Promise<any> {
    return Promise.resolve(); // Reemplaza con tu lógica
  }
  
  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Verifica el token en el localStorage
  }
}

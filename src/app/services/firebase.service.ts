import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 
import { from } from 'rxjs'; 
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private firestore: AngularFirestore, private authService: AuthService,private afAuth: AngularFireAuth, private http: HttpClient) {}

  // Método para agregar una nueva empresa
  addEmpresa(empresa: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addEmpresa`, empresa);
  }

  // Método para obtener todas las empresas
  getEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getEmpresa`);
  }
  // Eliminar empresa
  deleteEmpresa(codigoEmpresa: string, idEmpresa: number): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore.collection('empresas', ref =>
        ref.where('codigoEmpresa', '==', codigoEmpresa)
           .where('idEmpresa', '==', idEmpresa)
      ).get().subscribe(snapshot => {
        if (!snapshot.empty) {
          // Si se encuentra un documento, procedemos a eliminarlo
          const docId = snapshot.docs[0].id;
          this.firestore.collection('empresas').doc(docId).delete()
            .then(() => {
              observer.next();
              observer.complete();
            })
            .catch(error => observer.error(error));
        } else {
          observer.error(new Error('No se encontró la empresa con el código y ID proporcionados'));
        }
      }, error => observer.error(error));
    });
  }
  

  // Modificar empresa
  updateEmpresa(codigoEmpresa: string, empresaActualizada: any): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore.collection('empresas', ref =>
        ref.where('codigoEmpresa', '==', codigoEmpresa)
      ).get().subscribe(snapshot => {
        if (!snapshot.empty) {
          // Si se encuentra un documento, procedemos a actualizarlo
          const docId = snapshot.docs[0].id;
          this.firestore.collection('empresas').doc(docId).update(empresaActualizada)
            .then(() => {
              observer.next();
              observer.complete();
            })
            .catch(error => observer.error(error));
        } else {
          observer.error(new Error('No se encontró la empresa con el código proporcionado'));
        }
      }, error => observer.error(error));
    });
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
  validarCodigoEmpresa(codigo: string): Observable<any> {
    return this.firestore.collection('empresas', ref => ref.where('codigoEmpresa', '==', codigo)).valueChanges();
  }
  addUsuario(usuario: any): Promise<any> {
    return this.firestore.collection('usuarios').add(usuario);
  }
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
  getEncuestasPorDia(): Observable<any> {
    return this.getEncuestas().pipe(
      map(encuestas => {
        const diasDeLaSemana: { [key: string]: number } = {
          lunes: 0,
          martes: 0,
          miercoles: 0,
          jueves: 0,
          viernes: 0,
          sabado: 0,
          domingo: 0
        };
  
        // Obtener el lunes de la semana actual
        const hoy = new Date();
        const diaSemanaHoy = hoy.getDay(); // Domingo = 0, Lunes = 1, ..., Sábado = 6
        const inicioSemana = new Date(hoy.setDate(hoy.getDate() - diaSemanaHoy + (diaSemanaHoy === 0 ? -6 : 1))); // Lunes de esta semana
        inicioSemana.setHours(0, 0, 0, 0); // Restablecer la hora al inicio del día
    
        encuestas.forEach(encuesta => {
          let fechaRealizacion = encuesta.fechaRealizacion;
        
          // Conversión del string "DD-MM-YYYY" a un objeto Date
          if (typeof fechaRealizacion === 'string') {
            const [day, month, year] = fechaRealizacion.split('-');
            fechaRealizacion = new Date(Number(year), Number(month) - 1, Number(day)); // Crear el objeto Date
          }
        
          // Establecer las horas de fechaRealizacion a 0 para evitar diferencias en la comparación
          fechaRealizacion.setHours(0, 0, 0, 0);
                
          // Comparar si la encuesta pertenece a esta semana
          if (fechaRealizacion >= inicioSemana) {
            // Convertir el nombre del día a minúsculas y sin acentos para que coincida con las claves del objeto
            const diaSemana = fechaRealizacion
              .toLocaleDateString('es-ES', { weekday: 'long' })
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
        
            // Incrementar el contador del día correspondiente
            if (diasDeLaSemana[diaSemana] !== undefined) {
              diasDeLaSemana[diaSemana]++;
            }
          }
        });
          
        return diasDeLaSemana;
      })
    );
  }
  getEncuestasPorDiaFiltrado(idEmpresa: number): Observable<any> {
    return this.getEncuestas().pipe(
      map(encuestas => {
        const diasDeLaSemana: { [key: string]: number } = {
          lunes: 0,
          martes: 0,
          miercoles: 0,
          jueves: 0,
          viernes: 0,
          sabado: 0,
          domingo: 0
        };
  
        const hoy = new Date();
        const diaSemanaHoy = hoy.getDay();
        const inicioSemana = new Date(hoy.setDate(hoy.getDate() - diaSemanaHoy + (diaSemanaHoy === 0 ? -6 : 1)));
        inicioSemana.setHours(0, 0, 0, 0);
  
        encuestas.forEach(encuesta => {
          let fechaRealizacion = encuesta.fechaRealizacion;
          
          if (typeof fechaRealizacion === 'string') {
            const [day, month, year] = fechaRealizacion.split('-');
            fechaRealizacion = new Date(Number(year), Number(month) - 1, Number(day));
          }
  
          fechaRealizacion.setHours(0, 0, 0, 0);
  
          // Filtrar encuestas según el idEmpresa
          if (encuesta.empresa === idEmpresa && fechaRealizacion >= inicioSemana) {
            const diaSemana = fechaRealizacion
              .toLocaleDateString('es-ES', { weekday: 'long' })
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
  
            if (diasDeLaSemana[diaSemana] !== undefined) {
              diasDeLaSemana[diaSemana]++;
            }
          }
        });
  
        return diasDeLaSemana;
      })
    );
  }
  
  getEncuestasPorMes(): Observable<any> {
    return this.getEncuestas().pipe(
      map(encuestas => {
        const mesesDelAno: { [key: string]: number } = {
          enero: 0,
          febrero: 0,
          marzo: 0,
          abril: 0,
          mayo: 0,
          junio: 0,
          julio: 0,
          agosto: 0,
          septiembre: 0,
          octubre: 0,
          noviembre: 0,
          diciembre: 0
        };
  
        encuestas.forEach(encuesta => {
          let fechaRealizacion = encuesta.fechaRealizacion;
  
          // Conversión del string "DD-MM-YYYY" a un objeto Date
          if (typeof fechaRealizacion === 'string') {
            const [day, month, year] = fechaRealizacion.split('-');
            fechaRealizacion = new Date(Number(year), Number(month) - 1, Number(day));
          }
  
          const mes = fechaRealizacion.toLocaleDateString('es-ES', { month: 'long' })
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
  
          if (mesesDelAno[mes] !== undefined) {
            mesesDelAno[mes]++;
          }
        });
  
        return mesesDelAno;
      })
    );
  }
  
  getEncuestasPorMesFiltrado(idEmpresa: number): Observable<any> {
    return this.getEncuestas().pipe(
      map(encuestas => {
        const mesesDelAno: { [key: string]: number } = {
          enero: 0,
          febrero: 0,
          marzo: 0,
          abril: 0,
          mayo: 0,
          junio: 0,
          julio: 0,
          agosto: 0,
          septiembre: 0,
          octubre: 0,
          noviembre: 0,
          diciembre: 0
        };
  
        // Filtrar las encuestas que pertenecen a la empresa específica
        const encuestasFiltradas = encuestas.filter(encuesta => encuesta.empresa === idEmpresa);
  
        encuestasFiltradas.forEach(encuesta => {
          let fechaRealizacion = encuesta.fechaRealizacion;
  
          // Conversión del string "DD-MM-YYYY" a un objeto Date
          if (typeof fechaRealizacion === 'string') {
            const [day, month, year] = fechaRealizacion.split('-');
            fechaRealizacion = new Date(Number(year), Number(month) - 1, Number(day));
          }
  
          const mes = fechaRealizacion.toLocaleDateString('es-ES', { month: 'long' })
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
  
          if (mesesDelAno[mes] !== undefined) {
            mesesDelAno[mes]++;
          }
        });
  
        return mesesDelAno;
      })
    );
  }
  
  getEncuestasPorSucursal(): Observable<any> {
    return this.firestore.collection('encuestas').valueChanges().pipe(
      map((encuestas: any[]) => {
        const encuestasPorSucursal: { [key: string]: number } = {};
  
        encuestas.forEach(encuesta => {
          const sucursal = encuesta.sucursal; // Asegúrate de tener este campo en las encuestas
  
          if (!encuestasPorSucursal[sucursal]) {
            encuestasPorSucursal[sucursal] = 0;
          }
  
          encuestasPorSucursal[sucursal]++;
        });
  
        return encuestasPorSucursal; // Retornar el objeto con el conteo por sucursal
      })
    );
  }
  getEncuestasFiltradasPorEmpresa(idEmpresa: number): Observable<any[]> {
    return this.firestore.collection('encuestas', ref => ref.where('empresa', '==', idEmpresa)).valueChanges();
  }
  getSucursalesFiltrado(idEmpresa: number): Observable<any[]> {
    return this.firestore.collection('sucursales', ref => ref.where('empresa', '==', idEmpresa)).get().pipe(
      map(snapshot => snapshot.docs.map(doc => doc.data()))
    );
  }
  
  getEncuestasFiltrado(idEmpresa: number): Observable<any[]> {
    return this.firestore.collection('encuestas', ref => ref.where('empresa', '==', idEmpresa)).get().pipe(
      map(snapshot => snapshot.docs.map(doc => doc.data()))
    );
  }
  getSucursales2(): Observable<any[]> {
    return this.firestore.collection('sucursales').valueChanges();
  }
  getEncuestas2(): Observable<any[]> {
    return this.firestore.collection('encuestas').valueChanges();
  }
}

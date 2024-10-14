import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) { 
      console.log('Usuario autenticado');
      return true;
    } else {
      console.log('Usuario no autenticado, redirigiendo al login');
      this.router.navigate(['/login']);  // Redirige al login si no está autentificado
      return false;
    }
  }
}

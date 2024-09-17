import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css'],
})
export class SplashComponent implements OnInit {

  constructor(
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Para manejar las diferencias entre cliente y servidor
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Solo ejecutar la redirección en el navegador
      setTimeout(() => {
        this.router.navigateByUrl('login'); // Redirigir a la página de login después de 4 segundos
      }, 4000);
    } 
  }
}

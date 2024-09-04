import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.css',
})
export class SplashComponent {
  constructor(public router: Router) {
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 4000);
  }
}

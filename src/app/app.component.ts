import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'appMovil';
  private splashShown = false;
  
  constructor(private router: Router) {
    this.initializeApp();
  }
  initializeApp() {
    if (!this.splashShown) {
      this.splashShown = true;
      this.router.navigateByUrl('splash');
    }
  }
}

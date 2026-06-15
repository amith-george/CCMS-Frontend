import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  get isLoginRoute(): boolean {
    // Hide the sidebar if the URL contains '/login'
    return this.router.url.includes('/login');
  }
}

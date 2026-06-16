import { Component, inject, HostListener, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Sidebar } from './components/sidebar/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MatSidenavModule, MatIconModule, MatButtonModule, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private router = inject(Router);
  isMobile = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
  }

  get isFullScreenRoute(): boolean {
    // Hide the Court sidebar if the URL contains '/login' or '/bank'
    return this.router.url.includes('/login') || this.router.url.includes('/bank');
  }
}

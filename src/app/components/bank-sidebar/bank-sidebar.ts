import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bank-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bank-sidebar.html',
  styleUrls: ['./bank-sidebar.css']
})
export class BankSidebar {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BankSidebar } from '../bank-sidebar/bank-sidebar';

@Component({
  selector: 'app-bank-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, BankSidebar],
  templateUrl: './bank-layout.html',
  styleUrls: ['./bank-layout.css']
})
export class BankLayout {}

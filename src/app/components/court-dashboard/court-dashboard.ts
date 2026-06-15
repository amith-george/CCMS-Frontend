import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

export interface CaseMock {
  caseNumber: string;
  defendantName: string;
  targetBank: string;
  status: number;
  createdAt: string;
}

const MOCK_CASES: CaseMock[] = [
  { caseNumber: 'CCMS-20260614-0001', defendantName: 'John Doe', targetBank: 'State Bank of India', status: 0, createdAt: new Date().toISOString() },
  { caseNumber: 'CCMS-20260614-0002', defendantName: 'Jane Smith', targetBank: 'HDFC Bank', status: 1, createdAt: new Date().toISOString() },
];

@Component({
  selector: 'app-court-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, RouterLink, DatePipe],
  templateUrl: './court-dashboard.html',
  styleUrl: './court-dashboard.css'
})
export class CourtDashboard {
  displayedColumns: string[] = ['caseNumber', 'defendantName', 'targetBank', 'createdAt', 'status', 'actions'];
  dataSource = MOCK_CASES;

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Account Validated';
      case 2: return 'Freeze Applied';
      case 3: return 'Balance Provided';
      case 4: return 'Account Not Found';
      default: return 'Unknown';
    }
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0: return 'accent'; // Yellow/Orange
      case 1: return 'primary'; // Blue
      case 2: return 'warn'; // Red
      case 3: return 'primary'; // Blue
      case 4: return 'warn'; // Red
      default: return '';
    }
  }
}

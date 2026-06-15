import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { CaseService, CaseDto } from '../../services/case.service';

@Component({
  selector: 'app-court-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, RouterLink, DatePipe],
  templateUrl: './court-dashboard.html',
  styleUrl: './court-dashboard.css'
})
export class CourtDashboard implements OnInit {
  private caseService = inject(CaseService);

  displayedColumns: string[] = ['caseNumber', 'defendantName', 'targetBank', 'createdAt', 'status', 'actions'];
  dataSource: CaseDto[] = [];

  ngOnInit(): void {
    this.caseService.getCases().subscribe({
      next: (cases) => {
        this.dataSource = cases;
      },
      error: (err) => {
        console.error('Error fetching cases', err);
      }
    });
  }

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

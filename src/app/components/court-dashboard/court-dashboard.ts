import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { CaseService, CaseDto } from '../../services/case.service';

@Component({
  selector: 'app-court-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatPaginatorModule, RouterLink, DatePipe],
  templateUrl: './court-dashboard.html',
  styleUrl: './court-dashboard.css'
})
export class CourtDashboard implements OnInit, AfterViewInit {
  private caseService = inject(CaseService);

  displayedColumns: string[] = ['caseNumber', 'defendantName', 'targetBank', 'createdAt', 'status', 'actions'];
  dataSource = new MatTableDataSource<CaseDto>([]);
  selectedFilter: string = 'all';

  // Statistics
  totalCases: number = 0;
  pendingCases: number = 0;
  closedCases: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  applyFilter() {
    this.dataSource.filter = this.selectedFilter;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: CaseDto, filter: string) => {
      if (filter === 'all') return true;
      if (filter === 'closed') {
        // Closed means AccountNotFound (2), FreezeApplied (4), BalanceProvided (5)
        return data.status === 2 || data.status === 4 || data.status === 5;
      }
      return data.status.toString() === filter;
    };

    this.caseService.getCases().subscribe({
      next: (cases) => {
        this.dataSource.data = cases;
        this.calculateStats(cases);
      },
      error: (err) => {
        console.error('Error fetching cases', err);
      }
    });
  }

  calculateStats(cases: CaseDto[]) {
    this.totalCases = cases.length;
    this.pendingCases = cases.filter(c => c.status === 0).length; // 0 = Pending
    this.closedCases = cases.filter(c => c.status === 2 || c.status === 4 || c.status === 5).length;
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Account Validated';
      case 2: return 'Account Not Found';
      case 3: return 'Under Review';
      case 4: return 'Freeze Applied';
      case 5: return 'Balance Provided';
      default: return 'Unknown';
    }
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0: return 'accent'; // Yellow/Orange
      case 1: return 'primary'; // Blue
      case 2: return 'warn'; // Red
      case 3: return 'accent'; // Yellow/Orange for review
      case 4: return 'warn'; // Red
      case 5: return 'primary'; // Blue
      default: return '';
    }
  }
}

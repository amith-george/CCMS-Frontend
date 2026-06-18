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

  totalCasesForPagination: number = 0;

  loadCases() {
    const page = this.paginator ? this.paginator.pageIndex + 1 : 1;
    const limit = this.paginator ? this.paginator.pageSize : 15;
    
    this.caseService.getCases(page, limit, this.selectedFilter).subscribe({
      next: (result) => {
        this.dataSource.data = result.data;
        this.totalCasesForPagination = result.totalCount;
      },
      error: (err) => {
        console.error('Error fetching cases', err);
      }
    });
  }

  loadStatistics() {
    this.caseService.getStatistics().subscribe(stats => {
      this.totalCases = stats.totalCases;
      this.pendingCases = stats.pendingBatch;
      this.closedCases = stats.completed + stats.autoResolved;
    });
  }

  applyFilter() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadCases();
  }

  onPageChange() {
    this.loadCases();
  }

  ngAfterViewInit() {
    // We handle pagination manually now
  }

  ngOnInit(): void {
    this.loadStatistics();
    this.loadCases();
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

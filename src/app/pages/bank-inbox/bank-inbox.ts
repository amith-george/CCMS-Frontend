import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { BankApiService } from '../../services/bank-api.service';
import { BankCaseDto, CaseStatus, OrderType } from '../../models/bank.models';

@Component({
  selector: 'app-bank-inbox',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatTabsModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatPaginatorModule,
    DatePipe
  ],
  templateUrl: './bank-inbox.html',
  styleUrls: ['./bank-inbox.css']
})
export class BankInbox implements OnInit {
  private bankApiService = inject(BankApiService);
  private snackBar = inject(MatSnackBar);

  isLoading = true;
  errorMessage = '';

  // Categories of cases
  awaitingActionCases: BankCaseDto[] = [];
  pendingBatchCases: BankCaseDto[] = [];
  autoResolvedCases: BankCaseDto[] = [];
  completedCases: BankCaseDto[] = [];

  displayedColumns: string[] = ['caseNumber', 'defendantName', 'orderType', 'createdAt', 'actions'];
  completedColumns: string[] = ['caseNumber', 'defendantName', 'orderType', 'status', 'resolvedAt', 'actions'];

  // Enums for template
  OrderType = OrderType;
  CaseStatus = CaseStatus;

  stats: any = { awaitingAction: 0, completed: 0, autoResolved: 0, pendingBatch: 0 };
  activeTabIndex = 0;
  totalCasesForPagination = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadStats();
    this.loadCasesForTab();
  }

  loadStats() {
    this.bankApiService.getBankStatistics().subscribe(stats => {
      this.stats = stats;
      this.cdr.detectChanges();
    });
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadCasesForTab();
  }

  onPageChange() {
    this.loadCasesForTab();
  }

  loadCasesForTab(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const page = this.paginator ? this.paginator.pageIndex + 1 : 1;
    const limit = this.paginator ? this.paginator.pageSize : 15;
    
    let filter = 'awaitingAction';
    if (this.activeTabIndex === 1) filter = 'completed';
    else if (this.activeTabIndex === 2) filter = 'closed';
    else if (this.activeTabIndex === 3) filter = 'pending';

    this.bankApiService.getBankCases(page, limit, filter).subscribe({
      next: (response: any) => {
        try {
            const cases = response.data || [];
            this.totalCasesForPagination = response.totalCount || 0;

            if (this.activeTabIndex === 0) this.awaitingActionCases = cases;
            else if (this.activeTabIndex === 1) this.completedCases = cases;
            else if (this.activeTabIndex === 2) this.autoResolvedCases = cases;
            else if (this.activeTabIndex === 3) this.pendingBatchCases = cases;
        } catch (e: any) {
            console.error("Error processing cases:", e);
            this.errorMessage = "Error processing data: " + (e.message || e);
        } finally {
            this.isLoading = false;
            this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('Error loading cases:', err);
        this.errorMessage = "Failed to load cases: " + (err.message || err.statusText || 'Unknown error');
        this.snackBar.open('Failed to load cases', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getOrderTypeLabel(type: OrderType): string {
    return type === OrderType.FreezeAmount ? 'Freeze Account' : 'Balance Enquiry';
  }

  getStatusLabel(status: CaseStatus): string {
    switch (status) {
      case CaseStatus.FreezeApplied: return 'Freeze Applied';
      case CaseStatus.BalanceProvided: return 'Balance Provided';
      default: return 'Completed';
    }
  }

  getStatusColorClass(status: CaseStatus | string): string {
    if (status === CaseStatus.AccountNotFound || status === 'AccountNotFound') return 'status-red';
    if (status === CaseStatus.FreezeApplied) return 'status-green';
    if (status === CaseStatus.BalanceProvided) return 'status-orange';
    if (status === CaseStatus.AccountValidated) return 'status-blue';
    return 'status-default';
  }
}

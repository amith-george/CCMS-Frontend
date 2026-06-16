import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
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
    DatePipe
  ],
  templateUrl: './bank-inbox.html',
  styleUrls: ['./bank-inbox.css']
})
export class BankInbox implements OnInit {
  private bankApiService = inject(BankApiService);
  private snackBar = inject(MatSnackBar);

  isLoading = true;

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

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.isLoading = true;
    this.bankApiService.getBankCases().subscribe({
      next: (cases) => {
        this.awaitingActionCases = cases.filter(c => c.status === CaseStatus.AccountValidated);
        this.pendingBatchCases = cases.filter(c => c.status === CaseStatus.Pending);
        this.autoResolvedCases = cases.filter(c => c.status === CaseStatus.AccountNotFound);
        this.completedCases = cases.filter(c => 
          c.status === CaseStatus.FreezeApplied || 
          c.status === CaseStatus.BalanceProvided
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cases', err);
        this.snackBar.open('Failed to load cases', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  getOrderTypeLabel(type: OrderType): string {
    return type === OrderType.FreezeAccount ? 'Freeze Account' : 'Balance Enquiry';
  }

  getStatusLabel(status: CaseStatus): string {
    switch (status) {
      case CaseStatus.FreezeApplied: return 'Freeze Applied';
      case CaseStatus.BalanceProvided: return 'Balance Provided';
      default: return 'Completed';
    }
  }
}

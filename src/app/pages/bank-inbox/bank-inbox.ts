import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.bankApiService.getBankCases().subscribe({
      next: (response: any) => {
        try {
            console.log("Bank inbox cases response:", response);
            let cases: BankCaseDto[] = [];
            if (Array.isArray(response)) cases = response;
            else if (response && Array.isArray(response.data)) cases = response.data;
            else if (response && Array.isArray(response.$values)) cases = response.$values;

            this.awaitingActionCases = cases.filter((c: BankCaseDto) => c.status === CaseStatus.AccountValidated);
            this.pendingBatchCases = cases.filter((c: BankCaseDto) => c.status === CaseStatus.Pending);
            this.autoResolvedCases = cases.filter((c: BankCaseDto) => c.status === CaseStatus.AccountNotFound);
            this.completedCases = cases.filter((c: BankCaseDto) => 
              c.status === CaseStatus.FreezeApplied || 
              c.status === CaseStatus.BalanceProvided
            );
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
}

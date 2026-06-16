import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { BankApiService } from '../../services/bank-api.service';
import { CaseStatus } from '../../models/bank.models';

@Component({
  selector: 'app-bank-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './bank-dashboard.html',
  styleUrls: ['./bank-dashboard.css']
})
export class BankDashboard implements OnInit {
  private bankApiService = inject(BankApiService);
  private snackBar = inject(MatSnackBar);

  totalCases = 0;
  pendingBatch = 0;
  awaitingAction = 0;
  completed = 0;
  isLoading = true;
  isTriggeringBatch = false;
  lastRunTime: Date | null = null;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.bankApiService.getBankCases().subscribe({
      next: (cases) => {
        this.totalCases = cases.length;
        this.pendingBatch = cases.filter(c => c.status === CaseStatus.Pending).length;
        this.awaitingAction = cases.filter(c => c.status === CaseStatus.AccountValidated).length;
        this.completed = cases.filter(c => 
          c.status === CaseStatus.FreezeApplied || 
          c.status === CaseStatus.BalanceProvided || 
          c.status === CaseStatus.AccountNotFound
        ).length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cases', err);
        this.snackBar.open('Failed to load dashboard data', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  triggerBatchValidation(): void {
    this.isTriggeringBatch = true;
    this.bankApiService.triggerBatchValidation().subscribe({
      next: (response) => {
        this.isTriggeringBatch = false;
        this.lastRunTime = new Date();
        this.snackBar.open(`Batch processed successfully. Processed ${response.count} cases.`, 'Close', { duration: 5000 });
        this.loadDashboardData(); // Refresh stats
      },
      error: (err) => {
        this.isTriggeringBatch = false;
        this.snackBar.open('Error triggering batch validation', 'Close', { duration: 3000 });
      }
    });
  }
}

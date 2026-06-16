import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { BankApiService } from '../../services/bank-api.service';
import { CaseStatus, BankCaseDto } from '../../models/bank.models';

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
  private cdr = inject(ChangeDetectorRef);

  totalCases = 0;
  pendingBatch = 0;
  awaitingAction = 0;
  autoResolved = 0;
  completed = 0;
  isLoading = true;
  isTriggeringBatch = false;
  lastRunTime: Date | null = null;
  errorMessage = '';

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.bankApiService.getBankCases().subscribe({
      next: (response: any) => {
        try {
            console.log('Received dashboard cases response:', response);
            let cases: BankCaseDto[] = [];
            if (Array.isArray(response)) {
                cases = response;
            } else if (response && Array.isArray(response.data)) {
                cases = response.data;
            } else if (response && Array.isArray(response.$values)) {
                cases = response.$values;
            }

            this.totalCases = cases.length;
            this.pendingBatch = cases.filter((c: BankCaseDto) => c.status === CaseStatus.Pending).length;
            this.awaitingAction = cases.filter((c: BankCaseDto) => c.status === CaseStatus.AccountValidated).length;
            this.autoResolved = cases.filter((c: BankCaseDto) => c.status === CaseStatus.AccountNotFound).length;
            this.completed = cases.filter((c: BankCaseDto) => 
              c.status === CaseStatus.FreezeApplied || 
              c.status === CaseStatus.BalanceProvided
            ).length;
        } catch (e: any) {
            console.error('Error processing dashboard data:', e);
            this.errorMessage = "Error processing data: " + (e.message || e);
        } finally {
            this.isLoading = false;
            this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('Error loading cases:', err);
        this.errorMessage = "Failed to load statistics: " + (err.message || err.statusText || 'Unknown error');
        this.snackBar.open('Failed to load statistics', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  triggerBatchValidation(): void {
    this.isTriggeringBatch = true;
    this.bankApiService.triggerBatchValidation().subscribe({
      next: (response: any) => {
        this.isTriggeringBatch = false;
        this.lastRunTime = new Date();
        this.snackBar.open(`Batch processed successfully. Processed ${response.count} cases.`, 'Close', { duration: 5000 });
        this.loadStatistics(); // Refresh stats
      },
      error: (err: any) => {
        this.isTriggeringBatch = false;
        this.snackBar.open('Error triggering batch validation', 'Close', { duration: 3000 });
      }
    });
  }
}

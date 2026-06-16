import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { BankApiService } from '../../services/bank-api.service';
import { BankCaseDto, CaseStatus, OrderType, BankResponseDto } from '../../models/bank.models';

@Component({
  selector: 'app-bank-case-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ReactiveFormsModule,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './bank-case-detail.html',
  styleUrls: ['./bank-case-detail.css']
})
export class BankCaseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bankApiService = inject(BankApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  caseId!: number;
  caseData: BankCaseDto | null = null;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';

  responseForm!: FormGroup;

  // Enums for template
  OrderType = OrderType;
  CaseStatus = CaseStatus;

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.caseId = +idParam;
      this.loadCaseDetails();
    }
  }

  loadCaseDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.bankApiService.getBankCaseById(this.caseId).subscribe({
      next: (data: any) => {
        try {
            console.log('Case details response:', data);
            
            // Handle unwrapping if the backend wraps the object
            let actualData = data;
            if (data && data.data) actualData = data.data;
            else if (data && data.$values && data.$values.length > 0) actualData = data.$values[0];

            this.caseData = actualData;
            this.initForm();
        } catch (e: any) {
            console.error('Error processing case details:', e);
            this.errorMessage = "Error processing data: " + (e.message || e);
        } finally {
            this.isLoading = false;
            this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('Error fetching case details', err);
        this.errorMessage = "Failed to load case details: " + (err.message || err.statusText || 'Unknown error');
        this.snackBar.open('Failed to load case details', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initForm(): void {
    if (!this.caseData) return;

    this.responseForm = this.fb.group({
      bankRemarks: ['', Validators.required]
    });

    if (this.caseData.orderType === OrderType.BalanceEnquiry) {
      // Pre-fill with batch found balance, allow user to adjust
      this.responseForm.addControl('finalReportedBalance', this.fb.control(this.caseData.batchFoundBalance, [Validators.required, Validators.min(0)]));
    } else if (this.caseData.orderType === OrderType.FreezeAmount) {
      // Empty input required, user must type freeze amount based on PDF
      this.responseForm.addControl('finalFreezeAmount', this.fb.control('', [Validators.required, Validators.min(0)]));
    }
  }

  maskData(data: string | undefined): string {
    if (!data) return 'N/A';
    if (data.length <= 4) return '****';
    return '****' + data.substring(data.length - 4);
  }

  submitResponse(): void {
    if (this.responseForm.invalid || !this.caseData) {
      this.responseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const responseDto: BankResponseDto = {
      bankRemarks: this.responseForm.value.bankRemarks
    };

    if (this.caseData.orderType === OrderType.BalanceEnquiry) {
      responseDto.finalReportedBalance = this.responseForm.value.finalReportedBalance;
    } else if (this.caseData.orderType === OrderType.FreezeAmount) {
      responseDto.finalFreezeAmount = this.responseForm.value.finalFreezeAmount;
    }

    this.bankApiService.submitBankResponse(this.caseId, responseDto).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.snackBar.open('Response submitted successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/bank/inbox']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        const errMsg = err.error?.error || 'Failed to submit response';
        this.snackBar.open(errMsg, 'Close', { duration: 5000 });
        this.cdr.detectChanges();
      }
    });
  }

  downloadDocument(): void {
    if (!this.caseId) return;
    
    this.snackBar.open('Downloading document...', 'Close', { duration: 2000 });
    this.bankApiService.downloadCourtOrder(this.caseId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `Court_Order_${this.caseData?.caseNumber || this.caseId}.pdf`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        console.error('Error downloading document:', err);
        this.snackBar.open('Failed to download document. It may not exist.', 'Close', { duration: 3000 });
      }
    });
  }

  getOrderTypeLabel(type: OrderType): string {
    return type === OrderType.FreezeAmount ? 'Freeze Account' : 'Balance Enquiry';
  }

  getStatusLabel(status: CaseStatus): string {
    switch (status) {
      case CaseStatus.Pending: return 'Pending Batch';
      case CaseStatus.AccountValidated: return 'Awaiting Action';
      case CaseStatus.AccountNotFound: return 'Auto-Resolved (Not Found)';
      case CaseStatus.FreezeApplied: return 'Freeze Applied';
      case CaseStatus.BalanceProvided: return 'Balance Provided';
      default: return 'Unknown';
    }
  }
}

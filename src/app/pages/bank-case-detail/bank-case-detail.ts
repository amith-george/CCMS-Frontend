import { Component, OnInit, inject } from '@angular/core';
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

  responseForm!: FormGroup;

  // Enums for template
  OrderType = OrderType;
  CaseStatus = CaseStatus;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.caseId = +idParam;
      this.loadCaseDetails();
    }
  }

  loadCaseDetails(): void {
    this.isLoading = true;
    this.bankApiService.getBankCaseById(this.caseId).subscribe({
      next: (data) => {
        this.caseData = data;
        this.initForm();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching case details', err);
        this.snackBar.open('Failed to load case details', 'Close', { duration: 3000 });
        this.isLoading = false;
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
    } else if (this.caseData.orderType === OrderType.FreezeAccount) {
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
    } else if (this.caseData.orderType === OrderType.FreezeAccount) {
      responseDto.finalFreezeAmount = this.responseForm.value.finalFreezeAmount;
    }

    this.bankApiService.submitBankResponse(this.caseId, responseDto).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.snackBar.open('Response submitted successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/bank/inbox']);
      },
      error: (err) => {
        this.isSubmitting = false;
        const errMsg = err.error?.error || 'Failed to submit response';
        this.snackBar.open(errMsg, 'Close', { duration: 5000 });
      }
    });
  }

  downloadDocument(): void {
    // Usually calls the API to download. For now just show a message.
    this.snackBar.open('Document download started...', 'Close', { duration: 2000 });
  }

  getOrderTypeLabel(type: OrderType): string {
    return type === OrderType.FreezeAccount ? 'Freeze Account' : 'Balance Enquiry';
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

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-case-submission',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatIconModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './case-submission.html',
  styleUrl: './case-submission.css'
})
export class CaseSubmission {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  caseForm: FormGroup = this.fb.group({
    defendantName: ['', Validators.required],
    targetBank: ['', Validators.required],
    accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    aadhaarNumber: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
    panNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
    orderType: [0, Validators.required],
    requestedFreezeAmount: [0, [Validators.min(0)]]
  });

  // Store uploaded files
  files: { [key: string]: File | null } = {
    courtOrder: null,
    aadhaarDoc: null,
    panDoc: null
  };

  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  readonly ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

  onFileChange(event: any, fieldName: string) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > this.MAX_FILE_SIZE) {
        this.snackBar.open(`File size exceeds 5MB limit.`, 'Close', { duration: 3000 });
        event.target.value = null;
        this.files[fieldName] = null;
        return;
      }
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.snackBar.open(`Only PDF, JPG, and PNG are allowed.`, 'Close', { duration: 3000 });
        event.target.value = null;
        this.files[fieldName] = null;
        return;
      }
      this.files[fieldName] = file;
    }
  }

  onSubmit() {
    if (this.caseForm.invalid) {
      this.caseForm.markAllAsTouched();
      return;
    }

    if (!this.files['courtOrder'] || !this.files['aadhaarDoc'] || !this.files['panDoc']) {
      this.snackBar.open('Please upload all three mandatory documents.', 'Close', { duration: 3000 });
      return;
    }

    console.log('Form Data:', this.caseForm.value);
    console.log('Files:', this.files);

    this.snackBar.open('Form valid! API integration will happen in the next branch.', 'Close', { duration: 3000 });
    
    // Simulate API delay
    setTimeout(() => {
      this.router.navigate(['/court/dashboard']);
    }, 1500);
  }

  get orderType() {
    return this.caseForm.get('orderType')?.value;
  }
}

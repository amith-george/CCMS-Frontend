import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { CaseService, CaseDetailsDto } from '../../services/case.service';

@Component({
  selector: 'app-case-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './case-details.html',
  styleUrl: './case-details.css'
})
export class CaseDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);
  private cdr = inject(ChangeDetectorRef);

  caseData: CaseDetailsDto | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = parseInt(idParam, 10);
        this.caseService.getCaseById(id).subscribe({
          next: (data) => {
            console.log('Case data received:', data);
            this.caseData = data;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error fetching case details:', err);
            this.errorMessage = err.message || 'Error occurred';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        console.error('No ID parameter found in route');
        this.errorMessage = 'No ID parameter';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  downloadDocument(documentId: number, fileName: string): void {
    if (this.caseData) {
      this.caseService.downloadDocument(this.caseData.id, documentId).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = fileName;
          anchor.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => console.error('Error downloading document:', err)
      });
    }
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

  getOrderTypeLabel(orderType: number): string {
    switch (orderType) {
      case 0: return 'Freeze Account';
      case 1: return 'Balance Enquiry';
      default: return 'Unknown';
    }
  }
}

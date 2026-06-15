import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule, RouterLink, DatePipe],
  templateUrl: './case-details.html',
  styleUrl: './case-details.css'
})
export class CaseDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);

  caseData: CaseDetailsDto | null = null;
  loading = true;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.caseService.getCaseById(id).subscribe({
        next: (data) => {
          this.caseData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching case details', err);
          this.loading = false;
        }
      });
    }
  }

  downloadDocument(documentId: number): void {
    if (this.caseData) {
      this.caseService.downloadDocument(this.caseData.id, documentId);
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Account Validated';
      case 2: return 'Freeze Applied';
      case 3: return 'Balance Provided';
      case 4: return 'Account Not Found';
      default: return 'Unknown';
    }
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0: return 'accent'; // Yellow/Orange
      case 1: return 'primary'; // Blue
      case 2: return 'warn'; // Red
      case 3: return 'primary'; // Blue
      case 4: return 'warn'; // Red
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

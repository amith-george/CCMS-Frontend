import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CaseDocumentDto {
  id: number;
  fileName: string;
  contentType: string;
  documentType: string;
}

export interface CaseDto {
  id: number;
  caseNumber: string;
  defendantName: string;
  targetBank: string;
  accountNumber: string;
  aadhaarNumber: string;
  panNumber: string;
  orderType: number;
  requestedFreezeAmount?: number;
  status: number;
  createdAt: string;
  resolvedAt?: string;
  bankRemarks?: string;
  systemRemarks?: string;
  matchedAccountNumber?: string;
  batchAccountStatus?: string;
  batchFoundBalance?: number;
  finalFreezeAmount?: number;
  finalReportedBalance?: number;
}

export interface CaseDetailsDto extends CaseDto {
  documents: CaseDocumentDto[];
}

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private http = inject(HttpClient);
  // Pointing to local backend URL for development
  private apiUrl = 'http://localhost:5042/api/cases';

  getCases(): Observable<CaseDto[]> {
    return this.http.get<CaseDto[]>(this.apiUrl);
  }

  getCaseById(id: number): Observable<CaseDetailsDto> {
    return this.http.get<CaseDetailsDto>(`${this.apiUrl}/${id}`);
  }

  createCase(formData: FormData): Observable<CaseDto> {
    return this.http.post<CaseDto>(this.apiUrl, formData);
  }

  downloadDocument(caseId: number, documentId: number): Observable<Blob> {
    const url = `${this.apiUrl}/${caseId}/documents/${documentId}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}

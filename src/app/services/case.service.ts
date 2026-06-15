import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private http = inject(HttpClient);
  // Pointing to local backend URL for development
  private apiUrl = 'http://localhost:5000/api/cases';

  getCases(): Observable<CaseDto[]> {
    return this.http.get<CaseDto[]>(this.apiUrl);
  }

  createCase(formData: FormData): Observable<CaseDto> {
    return this.http.post<CaseDto>(this.apiUrl, formData);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankCaseDto, BankResponseDto } from '../models/bank.models';

@Injectable({
  providedIn: 'root'
})
export class BankApiService {
  private http = inject(HttpClient);
  // Pointing to local backend URL for development
  private apiUrl = 'http://localhost:5000/api/bank';

  getBankCases(): Observable<BankCaseDto[]> {
    return this.http.get<BankCaseDto[]>(`${this.apiUrl}/cases`);
  }

  getBankCaseById(id: number): Observable<BankCaseDto> {
    return this.http.get<BankCaseDto>(`${this.apiUrl}/cases/${id}`);
  }

  submitBankResponse(id: number, responseDto: BankResponseDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/cases/${id}/response`, responseDto);
  }

  triggerBatchValidation(): Observable<{ message: string, count: number }> {
    return this.http.post<{ message: string, count: number }>(`${this.apiUrl}/batch/trigger`, {});
  }
}

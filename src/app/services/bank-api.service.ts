import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankCaseDto, BankResponseDto } from '../models/bank.models';
import { PagedResult, CaseStatisticsDto } from '../models/pagination.models';

@Injectable({
  providedIn: 'root'
})
export class BankApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5042/api/bank';

  getBankCases(page: number = 1, limit: number = 15, filter: string = 'all'): Observable<PagedResult<BankCaseDto>> {
    return this.http.get<PagedResult<BankCaseDto>>(`${this.apiUrl}/cases?page=${page}&limit=${limit}&filter=${filter}`);
  }

  getBankStatistics(): Observable<CaseStatisticsDto> {
    return this.http.get<CaseStatisticsDto>(`${this.apiUrl}/statistics`);
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

  downloadCourtOrder(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/cases/${id}/court-order`, {
      responseType: 'blob'
    });
  }
}

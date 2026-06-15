import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: number; // 0 = CourtOfficer, 1 = BankOfficer
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Signals for state management (modern Angular approach)
  public currentUser = signal<LoginResponse | null>(null);
  public isLoggedIn = signal<boolean>(false);

  constructor() {
    this.loadToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('ccms_token', response.token);
          localStorage.setItem('ccms_email', response.email);
          localStorage.setItem('ccms_role', response.role.toString());
          
          this.currentUser.set(response);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('ccms_token');
    localStorage.removeItem('ccms_email');
    localStorage.removeItem('ccms_role');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  private loadToken(): void {
    const token = localStorage.getItem('ccms_token');
    if (token) {
      this.currentUser.set({
        token,
        email: localStorage.getItem('ccms_email') || '',
        role: parseInt(localStorage.getItem('ccms_role') || '0', 10)
      });
      this.isLoggedIn.set(true);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('ccms_token');
  }
}

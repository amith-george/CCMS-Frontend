import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginRequest, LoginResponse } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully log in and set signals and localStorage', () => {
    const mockCredentials: LoginRequest = { email: 'test@example.com', password: 'password' };
    const mockResponse: LoginResponse = { token: 'mock-jwt-token', email: 'test@example.com', role: 0 };

    service.login(mockCredentials).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Verify localStorage
    expect(localStorage.getItem('ccms_token')).toBe('mock-jwt-token');
    expect(localStorage.getItem('ccms_email')).toBe('test@example.com');
    expect(localStorage.getItem('ccms_role')).toBe('0');

    // Verify signals
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUser()?.token).toBe('mock-jwt-token');
  });

  it('should successfully log out and clear signals and localStorage', () => {
    // Manually set some mock state
    localStorage.setItem('ccms_token', 'mock-jwt-token');
    service.isLoggedIn.set(true);

    service.logout();

    expect(localStorage.getItem('ccms_token')).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });
});

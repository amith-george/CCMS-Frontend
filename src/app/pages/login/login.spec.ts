import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService, LoginResponse } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn()
    };
    mockRouter = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate form if fields are empty', () => {
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(component.loginForm.valid).toBe(false);
  });

  it('should call login on valid form and navigate based on role 0', () => {
    const mockResponse: LoginResponse = { token: 'mock-jwt', email: 'test@test.com', role: 0 };
    mockAuthService.login.mockReturnValue(of(mockResponse));

    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/court/dashboard']);
  });

  it('should call login on valid form and navigate based on role 1', () => {
    const mockResponse: LoginResponse = { token: 'mock-jwt', email: 'test@test.com', role: 1 };
    mockAuthService.login.mockReturnValue(of(mockResponse));

    component.loginForm.setValue({ email: 'bank@example.com', password: 'password' });
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'bank@example.com', password: 'password' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/dashboard']);
  });

  it('should display error message on login failure', () => {
    mockAuthService.login.mockReturnValue(throwError(() => ({ error: { message: 'Invalid User' } })));

    component.loginForm.setValue({ email: 'bad@example.com', password: 'wrong' });
    component.onSubmit();

    expect(component.errorMessage()).toBe('Invalid User');
    expect(component.isLoading()).toBe(false);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseSubmission } from './case-submission';
import { CaseService } from '../../services/case.service';
import { Router, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('CaseSubmission', () => {
  let component: CaseSubmission;
  let fixture: ComponentFixture<CaseSubmission>;
  let mockCaseService: any;
  let router: Router;

  beforeEach(async () => {
    mockCaseService = {
      createCase: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CaseSubmission, ReactiveFormsModule, BrowserAnimationsModule, MatSnackBarModule],
      providers: [
        { provide: CaseService, useValue: mockCaseService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CaseSubmission);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stop submission if files are missing', () => {
    component.caseForm.setValue({
      defendantName: 'Jane Doe',
      targetBank: 'HDFC',
      accountNumber: '1234567890',
      aadhaarNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      orderType: 0,
      requestedFreezeAmount: 5000
    });

    component.onSubmit();
    
    // Valid form, but missing files
    expect(mockCaseService.createCase).not.toHaveBeenCalled();
  });

  it('should submit successfully if form and files are present', () => {
    component.caseForm.setValue({
      defendantName: 'Jane Doe',
      targetBank: 'HDFC',
      accountNumber: '1234567890',
      aadhaarNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      orderType: 0,
      requestedFreezeAmount: 5000
    });

    // Mock files
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    component.files = {
      courtOrder: mockFile,
      aadhaarDoc: mockFile,
      panDoc: mockFile
    };

    mockCaseService.createCase.mockReturnValue(of({ caseNumber: 'CCMS-123' }));

    component.onSubmit();

    expect(mockCaseService.createCase).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/court/dashboard']);
  });
});

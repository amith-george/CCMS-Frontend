import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankDashboard } from './bank-dashboard';
import { BankApiService } from '../../services/bank-api.service';
import { BankCaseDto } from '../../models/bank.models';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BankDashboard', () => {
  let component: BankDashboard;
  let fixture: ComponentFixture<BankDashboard>;
  let mockBankApiService: any;

  const mockBankCases: any[] = [
    { id: 1, caseNumber: 'C-001', targetBank: 'Bank A', accountNumber: '123', aadhaarNumber: '111', panNumber: 'P11', orderType: 'Freeze Amount', requestedFreezeAmount: 5000, status: 0, createdAt: '2026-06-16' }
  ];

  beforeEach(async () => {
    mockBankApiService = {
      getBankCases: vi.fn().mockReturnValue(of({ data: mockBankCases, totalCount: 1 })),
      getBankStatistics: vi.fn().mockReturnValue(of({ totalCases: 5, awaitingAction: 2, completed: 1, autoResolved: 1, pendingBatch: 1 }))
    };

    await TestBed.configureTestingModule({
      imports: [BankDashboard, BrowserAnimationsModule],
      providers: [
        { provide: BankApiService, useValue: mockBankApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bank statistics on init', () => {
    expect(mockBankApiService.getBankStatistics).toHaveBeenCalled();
    expect(component.totalCases).toBe(5);
    expect(component.pendingBatch).toBe(1);
  });
});

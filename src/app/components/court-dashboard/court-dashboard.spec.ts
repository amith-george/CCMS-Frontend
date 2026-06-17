import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourtDashboard } from './court-dashboard';
import { CaseService, CaseDto } from '../../services/case.service';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CourtDashboard', () => {
  let component: CourtDashboard;
  let fixture: ComponentFixture<CourtDashboard>;
  let mockCaseService: any;
  let router: Router;

  const mockCases: CaseDto[] = [
    { id: 1, caseNumber: 'C-001', defendantName: 'John', targetBank: 'Bank A', accountNumber: '123', aadhaarNumber: '111', panNumber: 'P11', orderType: 0, status: 0, createdAt: '2026-06-16' },
    { id: 2, caseNumber: 'C-002', defendantName: 'Jane', targetBank: 'Bank B', accountNumber: '456', aadhaarNumber: '222', panNumber: 'P22', orderType: 1, status: 1, createdAt: '2026-06-16' }
  ];

  beforeEach(async () => {
    mockCaseService = {
      getCases: vi.fn().mockReturnValue(of({ data: mockCases, totalCount: 2 })),
      getStatistics: vi.fn().mockReturnValue(of({ totalCases: 2, pendingBatch: 0, completed: 0, autoResolved: 0 }))
    };

    await TestBed.configureTestingModule({
      imports: [CourtDashboard, BrowserAnimationsModule],
      providers: [
        { provide: CaseService, useValue: mockCaseService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourtDashboard);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cases on init and apply them to the table', () => {
    expect(mockCaseService.getCases).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].caseNumber).toBe('C-001');
  });
});

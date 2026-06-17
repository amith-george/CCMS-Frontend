import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseDetails } from './case-details';
import { CaseService } from '../../services/case.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CaseDetails', () => {
  let component: CaseDetails;
  let fixture: ComponentFixture<CaseDetails>;
  let mockCaseService: any;

  beforeEach(async () => {
    mockCaseService = {
      getCaseById: vi.fn().mockReturnValue(of({ id: 1, caseNumber: 'C-001', documents: [] }))
    };

    await TestBed.configureTestingModule({
      imports: [CaseDetails, BrowserAnimationsModule],
      providers: [
        { provide: CaseService, useValue: mockCaseService },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: (key: string) => '1' }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CaseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load case details on init', () => {
    expect(mockCaseService.getCaseById).toHaveBeenCalledWith(1);
    expect(component.caseData?.id).toBe(1);
  });
});

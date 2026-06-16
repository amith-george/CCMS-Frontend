import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CaseService, CaseDto } from './case.service';

describe('CaseService', () => {
  let service: CaseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CaseService]
    });

    service = TestBed.inject(CaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cases successfully', () => {
    const mockCases: CaseDto[] = [
      { id: 1, caseNumber: 'C-001', defendantName: 'John', targetBank: 'Bank A', accountNumber: '123', aadhaarNumber: '111', panNumber: 'P11', orderType: 0, status: 0, createdAt: '2026-06-16' }
    ];

    service.getCases().subscribe(cases => {
      expect(cases.length).toBe(1);
      expect(cases[0].caseNumber).toBe('C-001');
    });

    const req = httpMock.expectOne('http://localhost:5042/api/cases');
    expect(req.request.method).toBe('GET');
    req.flush(mockCases);
  });

  it('should create a case using FormData', () => {
    const mockCase: CaseDto = { id: 2, caseNumber: 'C-002', defendantName: 'Jane', targetBank: 'Bank B', accountNumber: '456', aadhaarNumber: '222', panNumber: 'P22', orderType: 0, status: 0, createdAt: '2026-06-16' };
    const formData = new FormData();
    formData.append('defendantName', 'Jane');

    service.createCase(formData).subscribe(newCase => {
      expect(newCase.id).toBe(2);
    });

    const req = httpMock.expectOne('http://localhost:5042/api/cases');
    expect(req.request.method).toBe('POST');
    req.flush(mockCase);
  });
});

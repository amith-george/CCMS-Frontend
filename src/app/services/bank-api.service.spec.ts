import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BankApiService } from './bank-api.service';
import { BankResponseDto } from '../models/bank.models';

describe('BankApiService', () => {
  let service: BankApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BankApiService]
    });

    service = TestBed.inject(BankApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully submit bank response', () => {
    const mockResponseDto: BankResponseDto = {
      finalFreezeAmount: 500,
      bankRemarks: 'Freeze applied'
    };

    service.submitBankResponse(1, mockResponseDto).subscribe(response => {
      expect(response.message).toBe('Success');
    });

    const req = httpMock.expectOne('http://localhost:5042/api/bank/cases/1/response');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockResponseDto);
    req.flush({ message: 'Success' });
  });

  it('should successfully trigger batch validation', () => {
    service.triggerBatchValidation().subscribe(response => {
      expect(response.count).toBe(5);
    });

    const req = httpMock.expectOne('http://localhost:5042/api/bank/batch/trigger');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Completed', count: 5 });
  });
});

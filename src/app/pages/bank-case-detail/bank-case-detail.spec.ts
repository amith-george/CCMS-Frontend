import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankCaseDetail } from './bank-case-detail';
import { BankApiService } from '../../services/bank-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('BankCaseDetail', () => {
  let component: BankCaseDetail;
  let fixture: ComponentFixture<BankCaseDetail>;
  let mockBankApiService: any;
  let router: Router;

  beforeEach(async () => {
    mockBankApiService = {
      getBankCaseById: vi.fn().mockReturnValue(of({ id: 1, orderType: 0, batchFoundBalance: 100 })), // OrderType.FreezeAmount
      submitBankResponse: vi.fn().mockReturnValue(of({ success: true }))
    };

    await TestBed.configureTestingModule({
      imports: [BankCaseDetail, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [
        { provide: BankApiService, useValue: mockBankApiService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankCaseDetail);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form and submit response', () => {
    expect(mockBankApiService.getBankCaseById).toHaveBeenCalledWith(1);
    expect(component.responseForm).toBeDefined();

    component.responseForm.controls['bankRemarks'].setValue('Test remark');
    component.responseForm.controls['finalFreezeAmount'].setValue(50);
    
    component.submitResponse();
    expect(mockBankApiService.submitBankResponse).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/bank/inbox']);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankInbox } from './bank-inbox';
import { BankApiService } from '../../services/bank-api.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BankInbox', () => {
  let component: BankInbox;
  let fixture: ComponentFixture<BankInbox>;
  let mockBankApiService: any;

  beforeEach(async () => {
    mockBankApiService = {
      getBankStatistics: vi.fn().mockReturnValue(of({ awaitingAction: 1 })),
      getBankCases: vi.fn().mockReturnValue(of({ data: [{ id: 1 }], totalCount: 1 }))
    };

    await TestBed.configureTestingModule({
      imports: [BankInbox, BrowserAnimationsModule],
      providers: [
        { provide: BankApiService, useValue: mockBankApiService },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankInbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cases and switch tabs', () => {
    expect(mockBankApiService.getBankCases).toHaveBeenCalled();
    expect(component.awaitingActionCases.length).toBe(1);

    component.onTabChange({ index: 1 });
    expect(component.activeTabIndex).toBe(1);
    expect(mockBankApiService.getBankCases).toHaveBeenCalledTimes(2);
  });
});

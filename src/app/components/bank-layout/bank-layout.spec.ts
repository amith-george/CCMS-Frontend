import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankLayout } from './bank-layout';
import { ActivatedRoute } from '@angular/router';

describe('BankLayout', () => {
  let component: BankLayout;
  let fixture: ComponentFixture<BankLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankLayout],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

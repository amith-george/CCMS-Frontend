import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankSidebar } from './bank-sidebar';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

describe('BankSidebar', () => {
  let component: BankSidebar;
  let fixture: ComponentFixture<BankSidebar>;
  let mockAuthService: any;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = {
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BankSidebar],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankSidebar);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

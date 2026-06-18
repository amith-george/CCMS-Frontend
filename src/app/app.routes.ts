import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CourtDashboard } from './pages/court-dashboard/court-dashboard';
import { CaseSubmission } from './pages/case-submission/case-submission';
import { CaseDetails } from './pages/case-details/case-details';
import { BankLayout } from './components/bank-layout/bank-layout';
import { BankDashboard } from './pages/bank-dashboard/bank-dashboard';
import { BankInbox } from './pages/bank-inbox/bank-inbox';
import { BankCaseDetail } from './pages/bank-case-detail/bank-case-detail';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  
  // Protected Court Routes 
  { path: 'court/dashboard', component: CourtDashboard, canActivate: [authGuard] },
  { path: 'court/new-case', component: CaseSubmission, canActivate: [authGuard] },
  { path: 'court/case/:id', component: CaseDetails, canActivate: [authGuard] },

  // Protected Bank Routes
  {
    path: 'bank',
    component: BankLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: BankDashboard },
      { path: 'inbox', component: BankInbox },
      { path: 'case/:id', component: BankCaseDetail },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

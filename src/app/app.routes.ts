import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CourtDashboard } from './components/court-dashboard/court-dashboard';
import { CaseSubmission } from './components/case-submission/case-submission';
import { CaseDetails } from './components/case-details/case-details';
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
  { path: 'bank/dashboard', component: BankDashboard, canActivate: [authGuard] },
  { path: 'bank/inbox', component: BankInbox, canActivate: [authGuard] },
  { path: 'bank/case/:id', component: BankCaseDetail, canActivate: [authGuard] },
  { path: 'bank', redirectTo: 'bank/dashboard', pathMatch: 'full' }
];

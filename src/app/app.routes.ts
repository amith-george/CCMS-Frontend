import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CourtDashboard } from './components/court-dashboard/court-dashboard';
import { CaseSubmission } from './components/case-submission/case-submission';
import { CaseDetails } from './components/case-details/case-details';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  
  // Protected Court Routes 
  { path: 'court/dashboard', component: CourtDashboard },
  { path: 'court/new-case', component: CaseSubmission },
  { path: 'court/case/:id', component: CaseDetails }
];
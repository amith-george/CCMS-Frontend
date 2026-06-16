import { Routes } from '@angular/router';
import { CourtDashboard } from './components/court-dashboard/court-dashboard';
import { CaseSubmission } from './components/case-submission/case-submission';
import { CaseDetails } from './components/case-details/case-details';
import { BankLayout } from './components/bank-layout/bank-layout';
import { BankDashboard } from './pages/bank-dashboard/bank-dashboard';
import { BankInbox } from './pages/bank-inbox/bank-inbox';

export const routes: Routes = [
    { path: 'court/dashboard', component: CourtDashboard },
    { path: 'court/new-case', component: CaseSubmission },
    { path: 'court/case/:id', component: CaseDetails },
    { path: '', redirectTo: 'court/dashboard', pathMatch: 'full' },

    // Bank Routes (Added without touching the rest of the code)
    {
      path: 'bank',
      component: BankLayout,
      children: [
        { path: 'dashboard', component: BankDashboard },
        { path: 'inbox', component: BankInbox },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        // Components will be added in subsequent branches
      ]
    }
];

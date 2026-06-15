import { Routes } from '@angular/router';
import { CourtDashboard } from './components/court-dashboard/court-dashboard';

export const routes: Routes = [
    { path: 'court/dashboard', component: CourtDashboard },
    { path: '', redirectTo: 'court/dashboard', pathMatch: 'full' }
];

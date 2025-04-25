import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TempComponent } from './temp/temp.component';

export const PAGES_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'temp', component: TempComponent },
];

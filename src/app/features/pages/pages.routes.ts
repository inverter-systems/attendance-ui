import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TempComponent } from './temp/temp.component';
import { FullRegisterComponent } from '../auth/full-register/full-register.component';

export const PAGES_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'temp', component: TempComponent },
];

import { Routes } from '@angular/router';
import { Login } from './sections/auth/login';
import { Register } from './sections/auth/register';
import { Dashboard } from './sections/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];

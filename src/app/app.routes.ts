import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Po startu jdi na login
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
    // Zde později přidáme ochranu (Guard), aby sem nemohl nepřihlášený
  },
];

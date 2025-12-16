import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Po startu jdi na přihlášení
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'tabs', // Všechno, co začíná na "tabs", pošli do tabs.routes
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
  },
];
import { Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

// Funkce pro přesměrování
// Pokud není přihlášen, pošli ho na login
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

// Pokud UŽ JE přihlášen, pošli ho rovnou na úkoly (tabs)
const redirectLoggedInToTabs = () => redirectLoggedInTo(['tabs']);

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    // Tady přidáme ochranu: Kdo je přihlášen, nesmí na login, ale jde rovnou do aplikace
    ...canActivate(redirectLoggedInToTabs)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
    // Tady přidáme ochranu: Dovnitř smí jen přihlášený, jinak jde na login
    ...canActivate(redirectUnauthorizedToLogin)
  },
];

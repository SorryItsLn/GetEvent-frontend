import { Routes } from '@angular/router';

import { AUTH_ROUTING_LINKS } from './consts';

export const authRoutes: Routes = [
  {
    path: AUTH_ROUTING_LINKS.SIGN_IN,
    loadComponent: async () => (await import('./login')).LoginComponent,
  },
  {
    path: AUTH_ROUTING_LINKS.SIGN_UP,
    loadComponent: async () => (await import('./register')).RegisterComponent,
  },
];

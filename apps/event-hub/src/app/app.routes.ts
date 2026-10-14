import { Routes } from '@angular/router';
import { authGuard, unAuthGuard } from '@myorg/modules';

import { AUTH_ROUTING_BASE } from '../auth/consts';
import { EVENT_ROUTING_BASE } from '../event/consts';
import { HOME_ROUTING_BASE } from '../home/consts';
import { USER_ROUTING_BASE } from '../user/consts';

export const appRoutes: Routes = [
  { path: '', redirectTo: `/${HOME_ROUTING_BASE}`, pathMatch: 'full' },
  {
    path: AUTH_ROUTING_BASE,
    loadChildren: async () => (await import('../auth')).authRoutes,
    canActivate: [unAuthGuard],
  },
  {
    path: HOME_ROUTING_BASE,
    loadChildren: async () => (await import('../home')).homeRoutes,
    canActivate: [authGuard],
  },
  {
    path: USER_ROUTING_BASE,
    loadChildren: async () => (await import('../user')).userRoutes,
    canActivate: [authGuard],
  },
  {
    path: EVENT_ROUTING_BASE,
    loadChildren: async () => (await import('../event')).eventRoutes,
    canActivate: [authGuard],
  },
  { path: '**', loadComponent: async () => (await import('../not-found')).NotFoundComponent },
];

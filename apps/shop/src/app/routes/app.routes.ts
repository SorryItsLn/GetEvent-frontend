import { Routes } from '@angular/router';
import { authGuard, unAuthGuard } from '@myorg/modules';

import { USER_ROUTING_BASE } from '../../user';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    loadChildren: async () => (await import('../../auth/auth-routing.module')).AuthModule,
    canActivate: [unAuthGuard],
  },
  {
    path: 'home',
    loadChildren: async () => (await import('../../home/home-routing.module')).HomeModule,
    canActivate: [authGuard],
  },
  {
    path: USER_ROUTING_BASE,
    loadChildren: async () => (await import('../../user')).UserRoutingModule,
    canActivate: [authGuard],
  },

  { path: '**', loadComponent: async () => (await import('../../not-found')).NotFoundComponent },
];

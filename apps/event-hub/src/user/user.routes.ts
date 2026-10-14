import { Routes } from '@angular/router';

import { USER_ROUTING_LINKS } from './consts';

export const userRoutes: Routes = [
  {
    path: USER_ROUTING_LINKS.ME,
    loadComponent: async () => (await import('./user-profile')).UserProfileComponent,
  },
];

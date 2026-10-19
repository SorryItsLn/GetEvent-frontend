import { Routes } from '@angular/router';

import { REGISTRATION_ROUTING_LINKS } from './consts';

export const registrationRoutes: Routes = [
  {
    path: REGISTRATION_ROUTING_LINKS.MAIN_PAGE,
    loadComponent: async () => (await import('./registration-list')).RegistrationListComponent,
  },
];

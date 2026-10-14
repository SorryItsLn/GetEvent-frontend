import { Routes } from '@angular/router';

import { HOME_ROUTING_LINKS } from './consts';

export const homeRoutes: Routes = [
  {
    path: HOME_ROUTING_LINKS.MAIN_PAGE,
    loadComponent: async () => (await import('./home-page')).HomePageComponent,
  },
];

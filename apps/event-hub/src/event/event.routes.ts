import { Routes } from '@angular/router';

import { EVENT_ROUTING_LINKS } from './consts';

export const eventRoutes: Routes = [
  {
    path: EVENT_ROUTING_LINKS.MAIN_PAGE,
    loadComponent: async () => (await import('./event-list')).EventListComponent,
  },
  {
    path: EVENT_ROUTING_LINKS.CREATION,
    loadComponent: async () => (await import('./event-creation')).EventCreationComponent,
  },
  {
    path: EVENT_ROUTING_LINKS.DETAILS,
    loadComponent: async () => (await import('./event-details')).EventDetailsComponent,
  },
];

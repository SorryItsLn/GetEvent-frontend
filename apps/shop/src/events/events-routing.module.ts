import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EVENT_ROUTING_LINKS } from './consts';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: EVENT_ROUTING_LINKS.MAIN_PAGE,
        loadComponent: async () => (await import('./events-page')).EventsComponent,
      },
      {
        path: EVENT_ROUTING_LINKS.CREATION,
        loadComponent: async () => (await import('./events-create')).EventsCreationComponent,
      },
      {
        path: EVENT_ROUTING_LINKS.DETAILS,
        loadComponent: async () => (await import('./events-details')).EventsDetailsComponent,
      },
    ]),
  ],
})
export class EventRoutingModule {}

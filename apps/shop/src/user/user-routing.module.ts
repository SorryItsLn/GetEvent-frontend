import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { USER_ROUTING_LINKS } from './consts';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: USER_ROUTING_LINKS.ME,
        loadComponent: async () => (await import('./user-profile')).UserProfileComponent,
      },
    ]),
  ],
})
export class UserRoutingModule {}

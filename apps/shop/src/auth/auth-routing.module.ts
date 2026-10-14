import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ROUTING_LINKS } from './consts/routing.consts';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ROUTING_LINKS.SIGN_IN,
        loadComponent: async () => (await import('./login')).LoginComponent,
      },
      {
        path: ROUTING_LINKS.SIGN_UP,
        loadComponent: async () => (await import('./register')).RegisterComponent,
      },
    ]),
  ],
})
export class AuthModule {}

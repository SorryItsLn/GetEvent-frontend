import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', loadComponent: async () => (await import('./home.component')).HomeComponent },
    ]),
  ],
})
export class HomeModule {}

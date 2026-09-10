import { Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserStore } from '@myorg/modules';

import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  private userState = inject(UserStore);

  constructor() {
    afterNextRender(() => {
      this.userState.getMe().subscribe();
    });
  }
}

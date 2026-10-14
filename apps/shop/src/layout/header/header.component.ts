import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserStore } from '@myorg/modules';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

import { ROUTING_LINKS } from '../../auth/consts/routing.consts';
import { USER_ROUTING_BASE, USER_ROUTING_LINKS } from '../../user/consts';

@Component({
  selector: 'app-header',
  imports: [TuiIcon, TuiButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #userState = inject(UserStore);
  protected userMe = this.#userState.userMe;

  logout() {
    this.#authService.logout();
    this.#router.navigateByUrl(ROUTING_LINKS.SIGN_IN);
  }

  navigateToUserProfile() {
    this.#router.navigateByUrl(`${USER_ROUTING_BASE}/${USER_ROUTING_LINKS.ME}`);
  }
}

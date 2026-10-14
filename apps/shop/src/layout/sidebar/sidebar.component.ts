import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserStore } from '@myorg/modules';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';

import { EVENT_ROUTING_BASE } from '../../events';
import { USER_ROUTING_BASE, USER_ROUTING_LINKS } from '../../user';

@Component({
  selector: 'app-sidebar',
  imports: [TuiIcon, TuiButton, TuiAvatar, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly #router = inject(Router);
  readonly #userState = inject(UserStore);
  protected userMe = this.#userState.userMe;

  protected readonly SIDEBAR_MENU_ITEMS = [
    { icon: 'calendar', routerUrl: EVENT_ROUTING_BASE, name: 'Мероприятия' },
    { icon: 'square-check-big', routerUrl: 'my-registration', name: 'Мои записи' },
  ];

  navigateHome() {
    this.#router.navigateByUrl('home');
  }

  navigateToUserProfile() {
    this.#router.navigateByUrl(`${USER_ROUTING_BASE}/${USER_ROUTING_LINKS.ME}`);
  }
}

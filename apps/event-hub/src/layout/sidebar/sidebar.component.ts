import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserApiService } from '@myorg/modules';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';

import { EVENT_ROUTING_BASE } from '../../event/consts';
import { HOME_ROUTING_BASE } from '../../home/consts';
import { USER_ROUTING_BASE, USER_ROUTING_LINKS } from '../../user/consts';

@Component({
  selector: 'app-sidebar',
  imports: [TuiIcon, TuiButton, TuiAvatar, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly #userService = inject(UserApiService);

  protected readonly userMe = this.#userService.userMe;

  protected readonly HOME_ROUTE = `/${HOME_ROUTING_BASE}`;
  protected readonly USER_PROFILE_ROUTE = `/${USER_ROUTING_BASE}/${USER_ROUTING_LINKS.ME}`;
  protected readonly SIDEBAR_MENU_ITEMS = [
    { icon: 'calendar', routerUrl: `/${EVENT_ROUTING_BASE}`, name: 'Мероприятия' },
    { icon: 'square-check-big', routerUrl: '/my-registration', name: 'Мои записи' },
  ];
}

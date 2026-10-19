import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserApiService } from '@myorg/modules';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';

import { HOME_ROUTE, MAIN_NAVIGATION, USER_PROFILE_ROUTE } from '../consts';

@Component({
  selector: 'app-sidebar',
  imports: [TuiIcon, TuiButton, TuiAvatar, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly #userService = inject(UserApiService);

  protected readonly HOME_ROUTE = HOME_ROUTE;
  protected readonly USER_PROFILE_ROUTE = USER_PROFILE_ROUTE;
  protected readonly MAIN_NAVIGATION = MAIN_NAVIGATION;

  protected readonly userMe = this.#userService.userMe;
}

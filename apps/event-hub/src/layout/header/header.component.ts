import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@myorg/modules';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

import { AUTH_ROUTING_LINKS } from '../../auth/consts';
import { HOME_ROUTE } from '../consts';
import { LogoComponent } from '../logo';

@Component({
  selector: 'app-header',
  imports: [TuiIcon, TuiButton, RouterLink, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  protected readonly HOME_ROUTE = HOME_ROUTE;

  protected logout(): void {
    this.#authService.logout();
    this.#router.navigateByUrl(`/${AUTH_ROUTING_LINKS.SIGN_IN}`);
  }
}

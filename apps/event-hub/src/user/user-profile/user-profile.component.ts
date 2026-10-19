import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserApiService } from '@myorg/modules';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

import { AUTH_ROUTING_LINKS } from '../../auth/consts';

@Component({
  selector: 'app-user-profile',
  imports: [TuiButton, TuiIcon],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  readonly #authService = inject(AuthService);
  readonly #userService = inject(UserApiService);
  readonly #router = inject(Router);

  protected readonly user = this.#userService.userMe;
  protected readonly initial = computed(() => {
    const user = this.user();
    return (user?.userName || user?.email || '?').charAt(0).toUpperCase();
  });

  protected logout(): void {
    this.#authService.logout();
    this.#router.navigateByUrl(`/${AUTH_ROUTING_LINKS.SIGN_IN}`);
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@myorg/modules';
import { TuiRoot } from '@taiga-ui/core';

import { AuthLayoutComponent, UnauthLayoutComponent } from '../layout';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, AuthLayoutComponent, UnauthLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly #authService = inject(AuthService);

  protected readonly isAuth = this.#authService.isAuth;
}

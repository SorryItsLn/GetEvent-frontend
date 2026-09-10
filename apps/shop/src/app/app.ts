import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@myorg/modules';
import { TuiRoot } from '@taiga-ui/core';

import { AuthLayoutComponent } from '../layout/auth-layout/auth-layout.component';
import { UnauthLayoutComponent } from '../layout/unauth-layout/unauth-layout.component';

@Component({
  imports: [RouterModule, TuiRoot, UnauthLayoutComponent, AuthLayoutComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly authService = inject(AuthService);
  protected readonly isAuth = computed(() => this.authService.isAuth());
}

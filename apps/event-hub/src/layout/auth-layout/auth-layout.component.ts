import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { UserApiService } from '@myorg/modules';
import { take } from 'rxjs';

import { HeaderComponent } from '../header';
import { SidebarComponent } from '../sidebar';
import { TabBarComponent } from '../tab-bar';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, TabBarComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {
  readonly #userService = inject(UserApiService);
  readonly #destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.#userService.getMe().pipe(take(1), takeUntilDestroyed(this.#destroyRef)).subscribe();
    });
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '@myorg/modules';
import { TuiButton, TuiInput, TuiLink } from '@taiga-ui/core';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { switchMap } from 'rxjs';

import { HOME_ROUTING_BASE } from '../../home/consts';
import { AUTH_ROUTING_LINKS } from '../consts';

@Component({
  selector: 'app-register',
  imports: [TuiInput, FormField, FormRoot, TuiCardLarge, TuiForm, TuiButton, TuiLink, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  readonly #registerModel = signal<RegisterRequest>({ email: '', password: '', userName: '' });

  protected readonly LOGIN_ROUTE = `/${AUTH_ROUTING_LINKS.SIGN_IN}`;

  protected readonly registerForm = form(
    this.#registerModel,
    (schema) => {
      required(schema.email);
      email(schema.email);
      required(schema.password);
    },
    {
      submission: {
        action: async (field) => {
          this.#register(field().value());
        },
      },
    },
  );

  #register(request: RegisterRequest): void {
    const { email, password } = request;

    this.#authService
      .register(request)
      .pipe(switchMap(() => this.#authService.login({ email, password })))
      .subscribe(() => {
        this.#router.navigateByUrl(`/${HOME_ROUTING_BASE}`);
      });
  }
}

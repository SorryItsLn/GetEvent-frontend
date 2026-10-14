import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '@myorg/modules';
import { TuiButton, TuiInput, TuiLink } from '@taiga-ui/core';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';

import { HOME_ROUTING_BASE } from '../../home/consts';
import { AUTH_ROUTING_LINKS } from '../consts';

@Component({
  selector: 'app-login',
  imports: [TuiInput, FormField, FormRoot, TuiCardLarge, TuiForm, TuiButton, TuiLink, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  readonly #loginModel = signal<LoginRequest>({ email: '', password: '' });

  protected readonly REGISTER_ROUTE = `/${AUTH_ROUTING_LINKS.SIGN_UP}`;

  protected readonly loginForm = form(
    this.#loginModel,
    (schema) => {
      required(schema.email);
      email(schema.email);
      required(schema.password);
    },
    {
      submission: {
        action: async (field) => {
          this.#login(field().value());
        },
      },
    },
  );

  #login(request: LoginRequest): void {
    this.#authService.login(request).subscribe(() => {
      this.#router.navigateByUrl(`/${HOME_ROUTING_BASE}`);
    });
  }
}

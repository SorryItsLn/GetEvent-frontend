import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest, getApiErrorMessage } from '@myorg/modules';
import { TuiButton, TuiIcon, TuiInput, TuiLabel, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading, TuiPassword } from '@taiga-ui/kit';
import { finalize } from 'rxjs';

import { HOME_ROUTING_BASE } from '../../home/consts';
import { AUTH_ROUTING_LINKS } from '../consts';

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    FormRoot,
    RouterLink,
    TuiButton,
    TuiButtonLoading,
    TuiIcon,
    TuiInput,
    TuiLabel,
    TuiLink,
    TuiPassword,
    TuiTextfield,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  readonly #loginModel = signal<LoginRequest>({ email: '', password: '' });

  protected readonly REGISTER_ROUTE = `/${AUTH_ROUTING_LINKS.SIGN_UP}`;

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

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
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.#authService
      .login(request)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.#router.navigateByUrl(`/${HOME_ROUTING_BASE}`);
        },
        error: (error: unknown) => {
          this.errorMessage.set(getApiErrorMessage(error, 'Неверный email или пароль'));
        },
      });
  }
}

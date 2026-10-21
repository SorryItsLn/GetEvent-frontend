import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest, getApiErrorMessage } from '@myorg/modules';
import { TuiButton, TuiIcon, TuiInput, TuiLabel, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading, TuiPassword } from '@taiga-ui/kit';
import { finalize, switchMap } from 'rxjs';

import { HOME_ROUTING_BASE } from '../../home/consts';
import { AUTH_ROUTING_LINKS } from '../consts';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  readonly #registerModel = signal<RegisterRequest>({ email: '', password: '', userName: '' });

  protected readonly LOGIN_ROUTE = `/${AUTH_ROUTING_LINKS.SIGN_IN}`;

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

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
    if (this.isSubmitting()) {
      return;
    }

    const { email, password } = request;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.#authService
      .register(request)
      .pipe(
        switchMap(() => this.#authService.login({ email, password })),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: () => {
          this.#router.navigateByUrl(`/${HOME_ROUTING_BASE}`);
        },
        error: (error: unknown) => {
          this.errorMessage.set(
            getApiErrorMessage(error, 'Не удалось зарегистрироваться, попробуйте ещё раз'),
          );
        },
      });
  }
}

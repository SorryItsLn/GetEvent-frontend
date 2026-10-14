import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserRegisterReq } from '@myorg/modules';
import { TuiButton, TuiInput, TuiLink } from '@taiga-ui/core';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { switchMap } from 'rxjs';

import { ROUTING_LINKS } from '../consts/routing.consts';

@Component({
  selector: 'app-auth-component',
  imports: [TuiInput, FormField, FormRoot, TuiCardLarge, TuiForm, TuiButton, RouterLink, TuiLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #registerSignal = signal<UserRegisterReq>({
    email: '',
    password: '',
    userName: '',
  });
  protected readonly registerLinkRoute = `/${ROUTING_LINKS.SIGN_IN}`;

  protected readonly registerForm = form(
    this.#registerSignal,
    (schema) => {
      required(schema.email);
      email(schema.email);
      required(schema.password);
    },
    {
      submission: {
        action: async (field) => {
          const data = field().value();
          this.register(data);
        },
      },
    },
  );

  register(req: UserRegisterReq) {
    this.#authService
      .register(req)
      .pipe(switchMap(() => this.#authService.login({ email: req.email, password: req.password })))
      .subscribe(() => {
        this.#router.navigateByUrl('/home');
      });
  }
}

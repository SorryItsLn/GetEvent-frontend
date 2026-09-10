import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserRegisterReq } from '@myorg/modules';
import { TuiButton, TuiInput, TuiLink } from '@taiga-ui/core';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';

import { ROUTING_LINKS } from '../consts/routing.consts';

@Component({
  selector: 'app-login',
  imports: [TuiInput, FormField, FormRoot, TuiCardLarge, TuiForm, TuiButton, TuiLink, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly registerSignal = signal<Omit<UserRegisterReq, 'userName'>>({ email: '', password: '' });
  protected readonly registerLinkRoute = `/${ROUTING_LINKS.SIGN_UP}`;

  protected readonly registerForm = form(
    this.registerSignal,
    (schema) => {
      required(schema.email);
      email(schema.email);
      required(schema.password);
    },
    {
      submission: {
        action: async (field) => {
          const data = field().value();
          this.login(data);
        },
      },
    },
  );

  login(req: Omit<UserRegisterReq, 'userName'>) {
    this.authService.login(req).subscribe(() => {
      console.log('asd');

      this.router.navigateByUrl('/home');
    });
  }
}

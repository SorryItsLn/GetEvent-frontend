import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const { isAuth } = inject(AuthService);
  const router = inject(Router);

  if (isAuth()) {
    return true;
  }

  return new RedirectCommand(router.parseUrl('/sign-up'));
};

export const unAuthGuard: CanActivateFn = () => {
  const { isAuth } = inject(AuthService);

  return !isAuth();
};

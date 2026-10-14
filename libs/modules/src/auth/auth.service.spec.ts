import { TestBed } from '@angular/core/testing';
import { ApiGateway, CookieService } from '@myorg/core';
import { of, tap } from 'rxjs';

import { AuthService } from './auth.service';
import { AUTH_COOKIE_KEY } from './consts';

describe('AuthService', () => {
  let service: AuthService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ApiGateway,
          useValue: {
            post: () => of('token').pipe(tap(() => cookieService.set(AUTH_COOKIE_KEY, 'token'))),
          },
        },
      ],
    });
    cookieService = TestBed.inject(CookieService);
    cookieService.remove(AUTH_COOKIE_KEY);
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be authorized right after login response', () => {
    expect(service.isAuth()).toBe(false);

    let isAuthOnResponse = false;
    service.login({ email: 'user@mail.com', password: 'password' }).subscribe(() => {
      isAuthOnResponse = service.isAuth();
    });

    expect(isAuthOnResponse).toBe(true);
  });

  it('should not be authorized after logout', () => {
    service.login({ email: 'user@mail.com', password: 'password' }).subscribe();
    service.logout();

    expect(service.isAuth()).toBe(false);
  });
});

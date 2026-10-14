import { Service, computed, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiGateway, CookieService } from '@myorg/core';
import { EMPTY, Observable, fromEvent, take, tap } from 'rxjs';

import { AUTH_COOKIE_KEY } from './consts';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './types';

@Service()
export class AuthService {
  readonly #apiGateway = inject(ApiGateway);
  readonly #cookieService = inject(CookieService);
  readonly #baseUrl = 'auth';

  readonly #cookieChange = toSignal(
    'cookieStore' in window ? fromEvent(window.cookieStore, 'change') : EMPTY,
    { initialValue: null },
  );

  readonly #token = linkedSignal<string | null>(() => {
    this.#cookieChange();
    return this.#cookieService.get(AUTH_COOKIE_KEY);
  });

  readonly isAuth = computed<boolean>(() => !!this.#token());

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.#apiGateway
      .post<RegisterResponse>(`${this.#baseUrl}/register`, { ...request })
      .pipe(take(1));
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.#apiGateway.post<LoginResponse>(`${this.#baseUrl}/login`, { ...request }).pipe(
      take(1),
      tap((token) => this.#setToken(token)),
    );
  }

  logout(): void {
    this.#cookieService.remove(AUTH_COOKIE_KEY);
    this.#setToken(null);
  }

  #setToken(token: string | null): void {
    this.#token.set(token);
  }
}

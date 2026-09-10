import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CookieService } from '@myorg/core';
import { Observable, fromEvent, take } from 'rxjs';

import { AUTH_COOKIE_KEY, AuthPaths } from '../consts';
import { Token, UserRegisterReq } from '../types/auth.type';

@Service()
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  private cookieEvent = toSignal(fromEvent(window.cookieStore, 'change'), { initialValue: null });

  private token = linkedSignal<string | null>(() => {
    this.cookieEvent();
    return this.cookieService.get(AUTH_COOKIE_KEY);
  });

  public isAuth = computed<boolean>(() => {
    return !!this.token();
  });

  public register(userReq: UserRegisterReq): Observable<Token> {
    return this.httpClient.post<string>(AuthPaths.REGISTER, userReq).pipe(take(1));
  }

  public login(userReq: Omit<UserRegisterReq, 'userName'>) {
    return this.httpClient.post<string>(AuthPaths.LOGIN, userReq).pipe(take(1));
  }

  public logout() {
    this.cookieService.remove(AUTH_COOKIE_KEY);
    this.token.set(null);
  }
}

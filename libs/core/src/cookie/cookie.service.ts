import { Service } from '@angular/core';

import { isDefined, isNumber } from '../common';
import { CookieOptions, CookieSettings } from './types';

@Service()
export class CookieService {
  exists(key: string): boolean {
    return !!this.get(key);
  }

  get(key: string): string | null {
    return getCookie(key);
  }

  set(key: string, value: string, params?: CookieOptions): void {
    setCookie(key, value, params);
  }

  remove(key: string): void {
    this.set(key, '', { expires: 0 });
  }
}

function getCookie(key: string): string | null {
  const value = document.cookie.match(
    new RegExp('(?:^|; )' + key.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'),
  );
  return value ? decodeURI(value[1]) : null;
}

function setCookie(key: string, value: string, options: CookieOptions = {}): void {
  const resultOptions: CookieSettings = { path: '/', samesite: true };
  if (isDefined(options.path)) {
    resultOptions.path = options.path;
  }
  if (isDefined(options.domain)) {
    resultOptions.domain = options.domain;
  }
  if (isDefined(options.expires)) {
    if (isNumber(options.expires)) {
      resultOptions['max-age'] = options.expires;
    }
    if (options.expires instanceof Date) {
      resultOptions.expires = options.expires.toUTCString();
    }
  }
  if (options.secure === true) {
    resultOptions.secure = options.secure;
  }
  if (options.sameSite) {
    resultOptions.samesite = options.sameSite;
  }
  let updatedCookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  Object.entries(resultOptions).forEach(([optionKey, optionValue]) => {
    const option = optionValue === true ? optionKey : `${optionKey}=${optionValue}`;
    updatedCookie += `; ${option}`;
  });
  document.cookie = updatedCookie;
}

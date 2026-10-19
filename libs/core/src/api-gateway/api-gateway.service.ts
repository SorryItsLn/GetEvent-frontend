import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { isDefined } from '../common';
import { PROXY_URL } from './consts';
import type { HttpClientRequestOptions, RequestBody, RequestOptions } from './types';

@Service()
export class ApiGateway {
  readonly #httpClient = inject(HttpClient);

  get<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.#httpClient.get<T>(buildUrl(path), transformOptions(options));
  }

  post<T>(path: string, body: RequestBody = {}, options?: RequestOptions): Observable<T> {
    return this.#httpClient.post<T>(buildUrl(path), body, transformOptions(options));
  }

  put<T>(path: string, body?: RequestBody, options?: RequestOptions): Observable<T> {
    return this.#httpClient.put<T>(buildUrl(path), body, transformOptions(options));
  }

  patch<T>(path: string, body?: RequestBody, options?: RequestOptions): Observable<T> {
    return this.#httpClient.patch<T>(buildUrl(path), body, transformOptions(options));
  }

  delete<T>(path: string, options?: RequestOptions & { body?: RequestBody }): Observable<T> {
    const resultOptions = {
      ...transformOptions(options),
      ...(isDefined(options?.body) ? { body: options.body } : {}),
    };
    return this.#httpClient.delete<T>(buildUrl(path), resultOptions);
  }
}

function buildUrl(path: string): string {
  return `${PROXY_URL}/${path}`;
}

function transformOptions(obj: RequestOptions = {}): HttpClientRequestOptions {
  const { queryParams, context, headers } = obj;
  return {
    ...(queryParams ? { params: queryParams } : {}),
    ...(context ? { context } : {}),
    ...(headers ? { headers } : {}),
  };
}

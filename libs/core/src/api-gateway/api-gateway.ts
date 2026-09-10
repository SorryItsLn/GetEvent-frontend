import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { isDefined } from '../common';
import { PROXY_URL } from './const/api-gateway.const';
import type {
  HttpClientRequestOptions,
  RequestBody,
  RequestOptions,
} from './types/api-gateway.type';

@Service()
export class ApiGateway {
  private httpClient = inject(HttpClient);

  get<T>(path: string, options?: RequestOptions): Observable<T> {
    path = `${PROXY_URL}/${path}`;
    return this.httpClient.get<T>(path, transformOptions(options));
  }

  post<T>(path: string, body: RequestBody = {}, options?: RequestOptions): Observable<T> {
    path = `${PROXY_URL}/${path}`;
    return this.httpClient.post<T>(path, body, transformOptions(options));
  }

  put<T>(path: string, body?: RequestBody, options?: RequestOptions): Observable<T> {
    path = `${PROXY_URL}/${path}`;
    return this.httpClient.put<T>(path, body, transformOptions(options));
  }

  patch<T>(path: string, body?: RequestBody, options?: RequestOptions): Observable<T> {
    path = `${PROXY_URL}/${path}`;
    return this.httpClient.patch<T>(path, body, transformOptions(options));
  }

  delete<T>(path: string, options?: RequestOptions & { body?: RequestBody }): Observable<T> {
    path = `${PROXY_URL}/${path}`;
    const resultOptions = {
      ...transformOptions(options),
      ...(isDefined(options?.body) ? { ...options.body } : {}),
    };
    return this.httpClient.delete<T>(path, resultOptions);
  }
}

function transformOptions(obj: RequestOptions = {}): HttpClientRequestOptions {
  const { queryParams, context } = obj;
  return { ...(queryParams ? { params: queryParams } : {}), ...(context ? { context } : {}) };
}

import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export type Params<T> = { [p: string]: T };
export type JSONParams = Params<JSONValue>;

export type QueryParams = Params<QueryValue | QueryValue[]>;

export type QueryValue = string | number | boolean;

export type JSONValue = null | boolean | number | string | JSONValue[] | { [k: string]: JSONValue };

export type FormDataParamsInputObject = {
  [key: string]: FormDataValue | FormDataParamsInputObject;
};

export type FormDataValue = undefined | null | boolean | number | string | File | FormDataValue[];

export type RequestBody = JSONParams | HttpParams | FormData | string;

export type RequestHeaders = HttpHeaders | Record<string, string | string[]>;

export type RequestOptions = {
  queryParams?: QueryParams;
  context?: HttpContext;
  headers?: RequestHeaders;
};

export type HttpClientRequestOptions = {
  context?: HttpContext;
  params?: HttpParams | QueryParams;
  headers?: RequestHeaders;
};

export type Paginated<T> = { items: T[]; totalCount: number; page: number; pageSize: number };

export type ApiErrorResponse = { error: string };

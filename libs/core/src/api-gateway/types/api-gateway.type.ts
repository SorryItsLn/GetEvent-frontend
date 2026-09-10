import { HttpContext, HttpParams } from '@angular/common/http';

export type Params<T> = { [p: string]: T };
export type JSONParams = Params<JSONValue>;

export type QueryParams = Params<QueryValue | QueryValue[]>;

export type QueryValue = string | number | boolean;

export type JSONValue = null | boolean | number | string | JSONValue[] | { [k: string]: JSONValue };

export type FormDataParamsInputObject = {
  [key: string]: FormDataValue | FormDataParamsInputObject;
};

export type FormDataValue = undefined | null | boolean | number | string | File | FormDataValue[];

export type RequestBody = JSONParams | HttpParams | FormData;

export type RequestOptions = { queryParams?: QueryParams; context?: HttpContext };

export type HttpClientRequestOptions = { context?: HttpContext; params?: HttpParams | QueryParams };

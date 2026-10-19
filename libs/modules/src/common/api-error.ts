import { HttpErrorResponse } from '@angular/common/http';
import { isString } from '@myorg/core';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const body: unknown = error.error;

  if (body && typeof body === 'object') {
    const { title, error: message } = body as { title?: unknown; error?: unknown };

    if (isString(message) && message) return message;
    if (isString(title) && title) return title;
  }

  return fallback;
}

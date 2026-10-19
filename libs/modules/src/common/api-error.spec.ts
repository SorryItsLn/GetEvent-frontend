import { HttpErrorResponse } from '@angular/common/http';

import { getApiErrorMessage } from './api-error';

describe('getApiErrorMessage', () => {
  const fallback = 'Что-то пошло не так';

  it('should return problem details title', () => {
    const error = new HttpErrorResponse({
      status: 409,
      error: { title: 'Вы уже записаны на это мероприятие' },
    });

    expect(getApiErrorMessage(error, fallback)).toBe('Вы уже записаны на это мероприятие');
  });

  it('should return api error message', () => {
    const error = new HttpErrorResponse({ status: 400, error: { error: 'Неверные данные' } });

    expect(getApiErrorMessage(error, fallback)).toBe('Неверные данные');
  });

  it('should return fallback for unknown errors', () => {
    expect(getApiErrorMessage(new Error('boom'), fallback)).toBe(fallback);
    expect(getApiErrorMessage(new HttpErrorResponse({ status: 500 }), fallback)).toBe(fallback);
    expect(
      getApiErrorMessage(
        new HttpErrorResponse({ status: 500, error: 'System.Exception' }),
        fallback,
      ),
    ).toBe(fallback);
  });
});

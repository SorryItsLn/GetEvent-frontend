import { Service, inject } from '@angular/core';
import { ApiGateway } from '@myorg/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { Observable, map, tap } from 'rxjs';

import { GetMeResponse, GetUserByIdResponse, User } from './types';

type UserState = { userMe: User | null };

@Service()
export class UserApiService extends signalStore(
  { protectedState: false },
  withState<UserState>({ userMe: null }),
) {
  readonly #apiGateway = inject(ApiGateway);
  readonly #baseUrl = 'user';

  getById(id: User['id']): Observable<GetUserByIdResponse> {
    return this.#apiGateway.get<GetUserByIdResponse>(`${this.#baseUrl}/GetById/${id}`);
  }

  getMe(): Observable<void> {
    return this.#apiGateway.get<GetMeResponse>(`${this.#baseUrl}/GetMe`).pipe(
      tap((user) => patchState(this, { userMe: user })),
      map(() => void 0),
    );
  }
}

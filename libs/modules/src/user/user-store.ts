import { Service, inject } from '@angular/core';
import { ApiGateway } from '@myorg/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { Observable, map, tap } from 'rxjs';

import { USER_PATH } from './consts';
import { User, UserState } from './types/user.type';

@Service()
export class UserStore extends signalStore(
  { protectedState: false },
  withState<UserState>({ userMe: null }),
) {
  private readonly apiGateway = inject(ApiGateway);

  getUserById(id: User['id']): Observable<User> {
    return this.apiGateway.get<User>(`${USER_PATH.GetById}/${id}`);
  }

  getMe(): Observable<void> {
    return this.apiGateway.get<User>(`${USER_PATH.GetMe}`).pipe(
      tap((user) => {
        patchState(this, { userMe: user });
      }),
      map(() => void 0),
    );
  }
}

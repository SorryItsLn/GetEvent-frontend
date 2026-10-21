import { Service, inject } from '@angular/core';
import { ApiGateway, updateStoreEntities, updateStoreEntity } from '@myorg/core';
import { patchState, signalStore, type } from '@ngrx/signals';
import { entityConfig, updateEntity, withEntities } from '@ngrx/signals/entities';
import { Observable, tap } from 'rxjs';

import {
  CountActiveRegistrationsResponse,
  CreateRegistrationRequest,
  CreateRegistrationResponse,
  Registration,
  SetRegistrationStatusRequest,
  SetRegistrationStatusResponse,
} from './types';

export const registrationEntityConfig = entityConfig({
  entity: type<Registration>(),
  collection: 'registrations',
  selectId: (item) => item.id,
});

@Service()
export class RegistrationApiService extends signalStore(
  { protectedState: false },
  withEntities(registrationEntityConfig),
) {
  readonly #apiGateway = inject(ApiGateway);
  readonly #baseUrl = 'registration';

  getById(id: Registration['id']): Observable<Registration> {
    return this.#apiGateway
      .get<Registration>(`${this.#baseUrl}/GetById/${id}`)
      .pipe(updateStoreEntity(this, registrationEntityConfig));
  }

  getByEventId(eventId: Registration['eventId']): Observable<Registration[]> {
    return this.#apiGateway
      .get<Registration[]>(`${this.#baseUrl}/GetByEventId/${eventId}`)
      .pipe(updateStoreEntities(this, registrationEntityConfig));
  }

  getByUserId(userId: Registration['userId']): Observable<Registration[]> {
    return this.#apiGateway
      .get<Registration[]>(`${this.#baseUrl}/GetByUserId/${userId}`)
      .pipe(updateStoreEntities(this, registrationEntityConfig));
  }

  countActive(eventId: Registration['eventId']): Observable<CountActiveRegistrationsResponse> {
    return this.#apiGateway.get<CountActiveRegistrationsResponse>(
      `${this.#baseUrl}/CountActive/${eventId}`,
    );
  }

  setStatus(
    id: Registration['id'],
    request: SetRegistrationStatusRequest,
  ): Observable<SetRegistrationStatusResponse> {
    return this.#apiGateway
      .put<SetRegistrationStatusResponse>(`${this.#baseUrl}/SetStatus/${id}`, { ...request })
      .pipe(
        tap(() =>
          patchState(
            this,
            updateEntity({ id, changes: { status: request.status } }, registrationEntityConfig),
          ),
        ),
      );
  }

  create(request: CreateRegistrationRequest): Observable<CreateRegistrationResponse> {
    return this.#apiGateway.post<CreateRegistrationResponse>(`${this.#baseUrl}/Create`, {
      ...request,
    });
  }
}

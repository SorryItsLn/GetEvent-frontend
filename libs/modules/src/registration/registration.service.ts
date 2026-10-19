import { Service, inject } from '@angular/core';
import { ApiGateway, updateStoreEntities, updateStoreEntity } from '@myorg/core';
import { signalStore, type } from '@ngrx/signals';
import { entityConfig, withEntities } from '@ngrx/signals/entities';
import { Observable } from 'rxjs';

import {
  CountActiveRegistrationsResponse,
  CreateRegistrationRequest,
  CreateRegistrationResponse,
  Registration,
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

  create(request: CreateRegistrationRequest): Observable<CreateRegistrationResponse> {
    return this.#apiGateway.post<CreateRegistrationResponse>(`${this.#baseUrl}/Create`, {
      ...request,
    });
  }
}

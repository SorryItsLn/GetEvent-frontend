import { Service, inject } from '@angular/core';
import { ApiGateway, updateStoreEntities, updateStoreEntity } from '@myorg/core';
import { signalStore, type, withState } from '@ngrx/signals';
import { entityConfig, withEntities } from '@ngrx/signals/entities';
import { Observable } from 'rxjs';

import { CreateRegistrationRequest, CreateRegistrationResponse, Registration } from './types';

type RegistrationState = { registrations: Registration[] };

export const registrationEntityConfig = entityConfig({
  entity: type<Registration>(),
  collection: 'registrations',
  selectId: (item) => item.id,
});

@Service()
export class RegistrationApiService extends signalStore(
  { protectedState: false },
  withState<RegistrationState>({ registrations: [] }),
  withEntities(registrationEntityConfig),
) {
  readonly #apiGateway = inject(ApiGateway);
  readonly #baseUrl = 'registration';

  getById(id: string): Observable<Registration> {
    return this.#apiGateway
      .get<Registration>(`${this.#baseUrl}/GetById/${id}`)
      .pipe(updateStoreEntity(this, registrationEntityConfig));
  }

  getByEventId(eventId: string): Observable<Registration[] | []> {
    return this.#apiGateway
      .get<Registration[]>(`${this.#baseUrl}/GetByEventId/${eventId}`)
      .pipe(updateStoreEntities(this, registrationEntityConfig));
  }

  getMy(): Observable<Registration[]> {
    return this.#apiGateway
      .get<Registration[]>(`${this.#baseUrl}/GetMy`)
      .pipe(updateStoreEntities(this, registrationEntityConfig));
  }

  create(request: CreateRegistrationRequest): Observable<CreateRegistrationResponse> {
    return this.#apiGateway.post<CreateRegistrationResponse>(`${this.#baseUrl}/Create`, {
      ...request,
    });
  }

  cancel(id: string): Observable<void> {
    return this.#apiGateway.put<void>(`${this.#baseUrl}/Cancel/${id}`, {});
  }
}

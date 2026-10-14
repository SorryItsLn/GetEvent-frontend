import { Service, inject } from '@angular/core';
import { ApiGateway } from '@myorg/core';
import { signalStore, withState } from '@ngrx/signals';
import { Observable } from 'rxjs';

import {
  CreateEventRequest,
  CreateEventResponse,
  Event,
  GetEventByIdResponse,
  GetPaginatedEventsQuery,
  GetPaginatedEventsResponse,
} from './types';

type EventState = { events: Event[] };

@Service()
export class EventApiService extends signalStore(
  { protectedState: false },
  withState<EventState>({ events: [] }),
) {
  readonly #apiGateway = inject(ApiGateway);
  readonly #baseUrl = 'event';

  getById(id: Event['id']): Observable<GetEventByIdResponse> {
    return this.#apiGateway.get<GetEventByIdResponse>(`${this.#baseUrl}/GetById/${id}`);
  }

  getPaginated(query: GetPaginatedEventsQuery): Observable<GetPaginatedEventsResponse> {
    return this.#apiGateway.get<GetPaginatedEventsResponse>(`${this.#baseUrl}/GetPaginated`, {
      queryParams: { ...query },
    });
  }

  create(request: CreateEventRequest): Observable<CreateEventResponse> {
    return this.#apiGateway.post<CreateEventResponse>(`${this.#baseUrl}/Create`, { ...request });
  }
}

import { Service, inject } from '@angular/core';
import { ApiGateway } from '@myorg/core';
import { signalStore, withState } from '@ngrx/signals';
import { Observable } from 'rxjs';

import {
  CreateEventRequest,
  CreateEventResponse,
  Event,
  GetEventByIdResponse,
  GetMyEventsQuery,
  GetMyEventsResponse,
  GetPaginatedEventsQuery,
  GetPaginatedEventsResponse,
  SetEventStatusRequest,
  SetEventStatusResponse,
  UpdateEventRequest,
  UpdateEventResponse,
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

  getMy(query: GetMyEventsQuery): Observable<GetMyEventsResponse> {
    return this.#apiGateway.get<GetMyEventsResponse>(`${this.#baseUrl}/GetMy`, {
      queryParams: { ...query },
    });
  }

  setStatus(id: Event['id'], request: SetEventStatusRequest): Observable<SetEventStatusResponse> {
    return this.#apiGateway.put<SetEventStatusResponse>(`${this.#baseUrl}/SetStatus/${id}`, {
      ...request,
    });
  }

  update(id: Event['id'], request: UpdateEventRequest): Observable<UpdateEventResponse> {
    return this.#apiGateway.put<UpdateEventResponse>(`${this.#baseUrl}/Update/${id}`, {
      ...request,
    });
  }

  create(request: CreateEventRequest): Observable<CreateEventResponse> {
    return this.#apiGateway.post<CreateEventResponse>(`${this.#baseUrl}/Create`, { ...request });
  }
}

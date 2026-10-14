import { Service, inject } from '@angular/core';
import { ApiGateway } from '@myorg/core';
import { signalStore, withState } from '@ngrx/signals';
import { Observable } from 'rxjs';

import {
  CreateVenueRequest,
  CreateVenueResponse,
  GetAllVenuesResponse,
  GetVenueByIdResponse,
  UpdateVenueRequest,
  UpdateVenueResponse,
  Venue,
} from './types';

type VenueState = { venues: Venue[] };

@Service()
export class VenueApiService extends signalStore(
  { protectedState: false },
  withState<VenueState>({ venues: [] }),
) {
  readonly #apiGateway = inject(ApiGateway);
  readonly #baseUrl = 'venues';

  getById(id: Venue['id']): Observable<GetVenueByIdResponse> {
    return this.#apiGateway.get<GetVenueByIdResponse>(`${this.#baseUrl}/${id}`);
  }

  getAll(): Observable<GetAllVenuesResponse> {
    return this.#apiGateway.get<GetAllVenuesResponse>(this.#baseUrl);
  }

  create(request: CreateVenueRequest): Observable<CreateVenueResponse> {
    return this.#apiGateway.post<CreateVenueResponse>(this.#baseUrl, { ...request });
  }

  update(id: Venue['id'], request: UpdateVenueRequest): Observable<UpdateVenueResponse> {
    return this.#apiGateway.put<UpdateVenueResponse>(`${this.#baseUrl}/${id}`, { ...request });
  }

  delete(id: Venue['id']): Observable<void> {
    return this.#apiGateway.delete<void>(`${this.#baseUrl}/${id}`);
  }
}

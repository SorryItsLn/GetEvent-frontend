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
  private readonly apiGateway = inject(ApiGateway);
  private readonly baseUrl = 'venues';

  getById(id: string): Observable<GetVenueByIdResponse> {
    return this.apiGateway.get<GetVenueByIdResponse>(`${this.baseUrl}/${id}`);
  }

  getAll(): Observable<GetAllVenuesResponse> {
    return this.apiGateway.get<GetAllVenuesResponse>(this.baseUrl);
  }

  create(request: CreateVenueRequest): Observable<CreateVenueResponse> {
    return this.apiGateway.post<CreateVenueResponse>(this.baseUrl, { ...request });
  }

  update(id: string, request: UpdateVenueRequest): Observable<UpdateVenueResponse> {
    return this.apiGateway.put<UpdateVenueResponse>(`${this.baseUrl}/${id}`, { ...request });
  }

  delete(id: string): Observable<void> {
    return this.apiGateway.delete<void>(`${this.baseUrl}/${id}`);
  }
}

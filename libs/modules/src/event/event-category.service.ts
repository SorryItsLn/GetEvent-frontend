import { Service, inject } from '@angular/core';
import { ApiGateway, updateStoreEntities } from '@myorg/core';
import { signalStore, type } from '@ngrx/signals';
import { entityConfig, withEntities } from '@ngrx/signals/entities';
import { Observable, of } from 'rxjs';

import {
  CreateEventCategoryRequest,
  CreateEventCategoryResponse,
  EventCategory,
  GetEventCategoryByIdResponse,
} from './types';

export const eventCategoryEntityConfig = entityConfig({
  entity: type<EventCategory>(),
  collection: 'eventCategories',
  selectId: (item) => item.id,
});

@Service()
export class EventCategoryApiService extends signalStore(
  { protectedState: false },
  withEntities(eventCategoryEntityConfig),
) {
  readonly #apiGateway = inject(ApiGateway);
  readonly #baseUrl = 'eventcategory';

  getById(id: EventCategory['id']): Observable<GetEventCategoryByIdResponse> {
    return this.#apiGateway.get<GetEventCategoryByIdResponse>(`${this.#baseUrl}/GetById/${id}`);
  }

  getAll(): Observable<EventCategory[]> {
    if (this.eventCategoriesEntities().length) {
      return of(this.eventCategoriesEntities());
    }

    return this.#apiGateway
      .get<EventCategory[]>(`${this.#baseUrl}/GetAll`)
      .pipe(updateStoreEntities(this, eventCategoryEntityConfig));
  }

  create(request: CreateEventCategoryRequest): Observable<CreateEventCategoryResponse> {
    return this.#apiGateway.post<CreateEventCategoryResponse>(`${this.#baseUrl}/Create`, {
      ...request,
    });
  }
}

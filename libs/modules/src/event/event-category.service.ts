import { Service, inject } from '@angular/core';
import { ApiGateway, updateStoreEntities } from '@myorg/core';
import { signalStore, type, withState } from '@ngrx/signals';
import { entityConfig, withEntities } from '@ngrx/signals/entities';
import { Observable, of, tap } from 'rxjs';

import {
  CreateEventCategoryRequest,
  CreateEventCategoryResponse,
  EventCategory,
  GetEventCategoryByIdResponse,
} from './types';

type EventCategoryState = { categories: EventCategory[] };

export const eventCategoryEntityConfig = entityConfig({
  entity: type<EventCategory>(),
  collection: 'eventCategories',
  selectId: (item) => item.id,
});

@Service()
export class EventCategoryApiService extends signalStore(
  { protectedState: false },
  withState<EventCategoryState>({ categories: [] }),
  withEntities(eventCategoryEntityConfig),
) {
  readonly #apiGateway = inject(ApiGateway);
  readonly #baseUrl = 'eventcategory';

  getById(id: string): Observable<EventCategory | null> {
    return this.#apiGateway.get<GetEventCategoryByIdResponse>(`${this.#baseUrl}/GetById/${id}`);
  }

  getAll(): Observable<EventCategory[]> {
    if (this.categories().length) {
      return of(this.categories());
    }

    return this.#apiGateway.get<EventCategory[]>(`${this.#baseUrl}/GetAll`).pipe(
      updateStoreEntities(this, eventCategoryEntityConfig),
      tap((categories) => console.log('Fetched event categories:', this.eventCategoriesEntities())),
    );
  }

  create(request: CreateEventCategoryRequest): Observable<CreateEventCategoryResponse> {
    return this.#apiGateway.post<CreateEventCategoryResponse>(`${this.#baseUrl}/Create`, {
      ...request,
    });
  }
}

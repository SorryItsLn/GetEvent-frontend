import { DatePipe } from '@angular/common';
import { Component, DestroyRef, afterNextRender, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventApiService, EventCategoryApiService, EventStatus } from '@myorg/modules';
import { TuiButton } from '@taiga-ui/core';
import { map, switchMap, take } from 'rxjs';

import { EVENT_ROUTING_PARAMS } from '../consts';

const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  Draft: 'Черновик',
  Published: 'Опубликовано',
  Cancelled: 'Отменено',
  Finished: 'Завершено',
};

@Component({
  selector: 'app-events-details',
  imports: [TuiButton, DatePipe, RouterLink],
  templateUrl: './events-details.component.html',
  styleUrl: './events-details.component.scss',
})
export class EventsDetailsComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #eventService = inject(EventApiService);
  readonly #eventCategoryService = inject(EventCategoryApiService);
  readonly #destroyRef = inject(DestroyRef);

  protected readonly EVENT_STATUS_LABELS = EVENT_STATUS_LABELS;

  protected readonly event = toSignal(
    this.#route.paramMap.pipe(
      map((params) => params.get(EVENT_ROUTING_PARAMS.ID) ?? ''),
      switchMap((id) => this.#eventService.getById(id)),
    ),
  );

  protected readonly category = computed(() => {
    const event = this.event();
    return event ? this.#eventCategoryService.eventCategoriesEntityMap()[event.categoryId] : null;
  });

  constructor() {
    afterNextRender(() => {
      this.#eventCategoryService
        .getAll()
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe();
    });
  }
}

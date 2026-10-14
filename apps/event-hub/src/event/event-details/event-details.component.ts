import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventApiService, EventCategoryApiService } from '@myorg/modules';
import { TuiButton } from '@taiga-ui/core';
import { map, switchMap, take } from 'rxjs';

import { EVENT_ROUTING_PARAMS, EVENT_STATUS_LABELS } from '../consts';

@Component({
  selector: 'app-event-details',
  imports: [TuiButton, DatePipe, RouterLink],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsComponent {
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

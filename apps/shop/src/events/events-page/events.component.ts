import { DatePipe } from '@angular/common';
import { Component, DestroyRef, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EventApiService, EventCategoryApiService } from '@myorg/modules';
import { TuiButton } from '@taiga-ui/core';
import { take } from 'rxjs';

import { EVENT_ROUTING_LINKS } from '../consts';

@Component({
  selector: 'app-events',
  imports: [TuiButton, DatePipe, RouterLink],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  readonly #eventService = inject(EventApiService);
  readonly #eventCategoryService = inject(EventCategoryApiService);
  readonly #destroyRef = inject(DestroyRef);

  readonly eventCategoriesEntityMap = this.#eventCategoryService.eventCategoriesEntityMap;

  protected readonly EVENT_CREATION_ROUTE = EVENT_ROUTING_LINKS.CREATION;

  constructor() {
    afterNextRender(() => {
      this.#eventCategoryService
        .getAll()
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe();
    });
  }

  getPaginated = toSignal(this.#eventService.getPaginated({ page: 1, pageSize: 100 }));
}

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EventApiService, EventCategoryApiService } from '@myorg/modules';
import { TuiButton } from '@taiga-ui/core';
import { take } from 'rxjs';

import { EVENT_ROUTING_LINKS } from '../consts';

@Component({
  selector: 'app-event-list',
  imports: [TuiButton, DatePipe, RouterLink],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent {
  readonly #eventService = inject(EventApiService);
  readonly #eventCategoryService = inject(EventCategoryApiService);
  readonly #destroyRef = inject(DestroyRef);

  protected readonly EVENT_CREATION_ROUTE = EVENT_ROUTING_LINKS.CREATION;

  protected readonly eventCategoriesEntityMap = this.#eventCategoryService.eventCategoriesEntityMap;
  protected readonly events = toSignal(this.#eventService.getPaginated({ page: 1, pageSize: 100 }));

  constructor() {
    afterNextRender(() => {
      this.#eventCategoryService
        .getAll()
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe();
    });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EventApiService, EventCategoryApiService, UserApiService } from '@myorg/modules';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { map, take } from 'rxjs';

import { EVENT_ROUTING_BASE, EVENT_ROUTING_LINKS } from '../../event/consts';
import { EventCardComponent } from '../../event/event-card';
import { HOME_FEATURES } from '../consts';

const UPCOMING_EVENTS_COUNT = 3;

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, TuiButton, TuiIcon, EventCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly #eventService = inject(EventApiService);
  readonly #eventCategoryService = inject(EventCategoryApiService);
  readonly #userService = inject(UserApiService);
  readonly #destroyRef = inject(DestroyRef);

  protected readonly HOME_FEATURES = HOME_FEATURES;
  protected readonly EVENT_LIST_ROUTE = `/${EVENT_ROUTING_BASE}`;
  protected readonly EVENT_CREATION_ROUTE = `/${EVENT_ROUTING_BASE}/${EVENT_ROUTING_LINKS.CREATION}`;

  protected readonly userMe = this.#userService.userMe;
  protected readonly eventCategoriesEntityMap = this.#eventCategoryService.eventCategoriesEntityMap;
  protected readonly upcomingEvents = toSignal(
    this.#eventService
      .getPaginated({
        page: 1,
        pageSize: UPCOMING_EVENTS_COUNT,
        fromDate: new Date().toISOString(),
      })
      .pipe(map(({ items }) => items)),
  );

  constructor() {
    afterNextRender(() => {
      this.#eventCategoryService
        .getAll()
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe();
    });
  }
}

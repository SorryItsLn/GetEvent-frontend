import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  Event,
  EventApiService,
  EventCategoryApiService,
  Registration,
  RegistrationApiService,
  UserApiService,
} from '@myorg/modules';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import {
  Observable,
  catchError,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';

import { EVENT_ROUTING_BASE, REGISTRATION_STATUS_LABELS } from '../../event/consts';
import { EventCardComponent } from '../../event/event-card';

type RegistrationWithEvent = { registration: Registration; event: Event };

@Component({
  selector: 'app-registration-list',
  imports: [RouterLink, TuiButton, TuiIcon, EventCardComponent],
  templateUrl: './registration-list.component.html',
  styleUrl: './registration-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationListComponent {
  readonly #registrationService = inject(RegistrationApiService);
  readonly #eventService = inject(EventApiService);
  readonly #eventCategoryService = inject(EventCategoryApiService);
  readonly #userService = inject(UserApiService);
  readonly #destroyRef = inject(DestroyRef);

  readonly #items = toSignal(
    toObservable(this.#userService.userMe).pipe(
      map((user) => user?.id),
      filter((userId): userId is string => !!userId),
      distinctUntilChanged(),
      switchMap((userId) => this.#registrationService.getByUserId(userId)),
      switchMap((registrations) => this.#attachEvents(registrations)),
    ),
  );

  protected readonly EVENT_LIST_ROUTE = `/${EVENT_ROUTING_BASE}`;
  protected readonly REGISTRATION_STATUS_LABELS = REGISTRATION_STATUS_LABELS;

  protected readonly eventCategoriesEntityMap = this.#eventCategoryService.eventCategoriesEntityMap;
  protected readonly isLoading = computed(() => this.#items() === undefined);
  protected readonly isEmpty = computed(() => this.#items()?.length === 0);

  protected readonly upcoming = computed(() =>
    (this.#items() ?? [])
      .filter(({ event }) => !isPast(event))
      .sort((a, b) => startTime(a.event) - startTime(b.event)),
  );

  protected readonly past = computed(() =>
    (this.#items() ?? [])
      .filter(({ event }) => isPast(event))
      .sort((a, b) => startTime(b.event) - startTime(a.event)),
  );

  constructor() {
    afterNextRender(() => {
      this.#eventCategoryService
        .getAll()
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe();
    });
  }

  #attachEvents(registrations: Registration[]): Observable<RegistrationWithEvent[]> {
    const active = registrations.filter(({ status }) => status !== 'Cancelled');

    if (!active.length) {
      return of([]);
    }

    return forkJoin(
      active.map((registration) =>
        this.#eventService.getById(registration.eventId).pipe(
          map((event) => (event ? { registration, event } : null)),
          catchError(() => of(null)),
        ),
      ),
    ).pipe(map((items) => items.filter((item): item is RegistrationWithEvent => !!item)));
  }
}

function startTime(event: Event): number {
  return new Date(event.startDate).getTime();
}

function isPast(event: Event): boolean {
  return new Date(event.endDate ?? event.startDate).getTime() < Date.now();
}

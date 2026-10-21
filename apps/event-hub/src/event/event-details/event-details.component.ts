import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  EVENT_STATUS,
  Event,
  EventApiService,
  EventCategoryApiService,
  EventStatus,
  RegistrationApiService,
  UserApiService,
  getApiErrorMessage,
} from '@myorg/modules';
import { TuiButton, TuiIcon, TuiNotificationService } from '@taiga-ui/core';
import { TuiButtonLoading, TuiTabs } from '@taiga-ui/kit';
import { finalize, map, shareReplay, switchMap, take } from 'rxjs';

import {
  EVENT_ROUTING_PARAMS,
  EVENT_ROUTING_SEGMENTS,
  EVENT_STATUS_LABELS,
  REGISTRATION_STATUS_LABELS,
} from '../consts';
import { EventRegistrationsComponent } from '../event-registrations';
import { canManageEvent } from '../utils';

@Component({
  selector: 'app-event-details',
  imports: [
    TuiButton,
    TuiButtonLoading,
    TuiIcon,
    TuiTabs,
    DatePipe,
    RouterLink,
    EventRegistrationsComponent,
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #eventService = inject(EventApiService);
  readonly #eventCategoryService = inject(EventCategoryApiService);
  readonly #registrationService = inject(RegistrationApiService);
  readonly #userService = inject(UserApiService);
  readonly #notificationService = inject(TuiNotificationService);
  readonly #destroyRef = inject(DestroyRef);

  readonly #eventId$ = this.#route.paramMap.pipe(
    map((params) => params.get(EVENT_ROUTING_PARAMS.ID) ?? ''),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly #loadedEvent = toSignal(
    this.#eventId$.pipe(switchMap((id) => this.#eventService.getById(id))),
  );

  readonly #registrations = computed(() => {
    const eventId = this.event()?.id;
    return this.#registrationService
      .registrationsEntities()
      .filter((registration) => registration.eventId === eventId);
  });

  protected readonly EVENT_STATUS = EVENT_STATUS;
  protected readonly EVENT_STATUS_LABELS = EVENT_STATUS_LABELS;
  protected readonly REGISTRATION_STATUS_LABELS = REGISTRATION_STATUS_LABELS;
  protected readonly EDIT_ROUTE = EVENT_ROUTING_SEGMENTS.EDIT;

  protected readonly event = linkedSignal(() => this.#loadedEvent());

  protected readonly category = computed(() => {
    const event = this.event();
    return event ? this.#eventCategoryService.eventCategoriesEntityMap()[event.categoryId] : null;
  });

  protected readonly activeTab = signal(0);
  protected readonly isRegistering = signal(false);
  protected readonly isStatusChanging = signal(false);

  protected readonly canManage = computed(() => {
    const event = this.event();
    return !!event && canManageEvent(event, this.#userService.userMe());
  });

  protected readonly isOrganizer = computed(
    () => this.event()?.organizerId === this.#userService.userMe()?.id,
  );

  protected readonly confirmedCount = computed(
    () => this.#registrations().filter(({ status }) => status === 'Confirmed').length,
  );

  protected readonly pendingCount = computed(
    () => this.#registrations().filter(({ status }) => status === 'Waitlisted').length,
  );

  protected readonly myRegistration = computed(() => {
    const userId = this.#userService.userMe()?.id;
    return this.#registrations().find((registration) => registration.userId === userId);
  });

  protected readonly registrationClosedReason = computed(() => {
    const event = this.event();
    return event ? getRegistrationClosedReason(event) : null;
  });

  constructor() {
    this.#eventId$
      .pipe(
        switchMap((id) => this.#registrationService.getByEventId(id)),
        takeUntilDestroyed(),
      )
      .subscribe();

    afterNextRender(() => {
      this.#eventCategoryService
        .getAll()
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe();
    });
  }

  protected changeStatus(status: EventStatus): void {
    const event = this.event();

    if (!event || event.status === status || this.isStatusChanging()) {
      return;
    }

    this.isStatusChanging.set(true);

    this.#eventService
      .setStatus(event.id, { status })
      .pipe(
        take(1),
        finalize(() => this.isStatusChanging.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: () => {
          this.event.set({ ...event, status });
          this.#notificationService
            .open(`Статус изменён: ${EVENT_STATUS_LABELS[status]}`, { appearance: 'positive' })
            .subscribe();
        },
        error: (error: unknown) => {
          this.#notificationService
            .open(getApiErrorMessage(error, 'Не удалось изменить статус'), {
              appearance: 'negative',
            })
            .subscribe();
        },
      });
  }

  protected register(): void {
    const eventId = this.event()?.id;

    if (!eventId || this.isRegistering()) {
      return;
    }

    this.isRegistering.set(true);

    this.#registrationService
      .create({ eventId })
      .pipe(
        switchMap(() => this.#registrationService.getByEventId(eventId)),
        take(1),
        finalize(() => this.isRegistering.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: () => {
          this.#notificationService
            .open('Заявка отправлена организатору', { appearance: 'positive' })
            .subscribe();
        },
        error: (error: unknown) => {
          this.#notificationService
            .open(getApiErrorMessage(error, 'Не удалось записаться, попробуйте ещё раз'), {
              appearance: 'negative',
            })
            .subscribe();
        },
      });
  }
}

function getRegistrationClosedReason({ status, registrationDeadline }: Event): string | null {
  switch (status) {
    case 'Draft':
      return 'Запись откроется после публикации';
    case 'Cancelled':
      return 'Мероприятие отменено';
    case 'Finished':
      return 'Мероприятие завершено';
  }

  if (registrationDeadline && new Date(registrationDeadline).getTime() < Date.now()) {
    return 'Регистрация закрыта';
  }

  return null;
}

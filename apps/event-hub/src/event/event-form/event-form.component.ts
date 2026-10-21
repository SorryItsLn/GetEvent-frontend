import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CreateEventRequest,
  Event,
  EventApiService,
  EventCategory,
  EventCategoryApiService,
  NominatimSuggestion,
  UpdateEventRequest,
  UserApiService,
  getApiErrorMessage,
} from '@myorg/modules';
import { TuiDay } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiCalendar,
  TuiInput,
  TuiLabel,
  TuiNotificationService,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TuiButtonLoading,
  TuiDataListWrapper,
  TuiInputDate,
  TuiSelect,
  TuiTextarea,
} from '@taiga-ui/kit';
import { finalize, map, of, take } from 'rxjs';

import { EVENT_ROUTING_BASE, EVENT_ROUTING_PARAMS } from '../consts';
import { canManageEvent } from '../utils';
import { InputVenueComponent } from './input-venue';

const TODAY = TuiDay.currentLocal();

@Component({
  selector: 'app-event-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TuiButton,
    TuiButtonLoading,
    TuiCalendar,
    TuiDataListWrapper,
    TuiInput,
    TuiInputDate,
    TuiLabel,
    TuiSelect,
    TuiTextarea,
    TuiTextfield,
    InputVenueComponent,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormComponent {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #destroyRef = inject(DestroyRef);
  readonly #route = inject(ActivatedRoute);
  readonly #eventCategoryService = inject(EventCategoryApiService);
  readonly #eventService = inject(EventApiService);
  readonly #userService = inject(UserApiService);
  readonly #notificationService = inject(TuiNotificationService);
  readonly #router = inject(Router);

  readonly #eventId = this.#route.snapshot.paramMap.get(EVENT_ROUTING_PARAMS.ID);

  protected readonly isEditMode = !!this.#eventId;
  protected readonly cancelRoute =
    this.#eventId ? `/${EVENT_ROUTING_BASE}/${this.#eventId}` : `/${EVENT_ROUTING_BASE}`;

  protected readonly eventForm = this.#fb.group({
    title: this.#fb.control('', Validators.required),
    category: this.#fb.control<EventCategory | null>(null, Validators.required),
    description: this.#fb.control(''),
    maxParticipants: this.#fb.control<number>(0),
    endDate: this.#fb.control(TODAY, Validators.required),
    registrationDeadline: this.#fb.control(TODAY, Validators.required),
    startDate: this.#fb.control(TODAY, Validators.required),
    venue: this.#fb.control<NominatimSuggestion | null>(null, Validators.required),
  });

  protected readonly eventCategories = toSignal(this.#eventCategoryService.getAll(), {
    initialValue: [],
  });

  protected readonly editedEvent = toSignal(
    this.#eventId ? this.#eventService.getById(this.#eventId) : of(null),
  );

  protected readonly isLoading = computed(
    () => this.isEditMode && this.editedEvent() === undefined,
  );

  protected readonly accessDenied = computed(() => {
    const event = this.editedEvent();
    const user = this.#userService.userMe();
    return this.isEditMode && !!event && !!user && !canManageEvent(event, user);
  });

  protected readonly isSaving = signal(false);

  constructor() {
    effect(() => {
      const categories = this.eventCategories();
      const event = this.editedEvent();

      if (!categories.length) {
        return;
      }

      if (this.isEditMode && event) {
        this.#fillForm(event, categories);
        return;
      }

      if (!this.isEditMode && !this.eventForm.controls.category.value) {
        this.eventForm.controls.category.setValue(categories[0]);
      }
    });
  }

  protected submit(): void {
    if (this.eventForm.invalid || this.isSaving()) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    const request$ =
      this.#eventId ?
        this.#eventService
          .update(this.#eventId, this.#buildUpdateRequest())
          .pipe(map(() => this.#eventId))
      : this.#eventService.create(this.#buildCreateRequest());

    request$
      .pipe(
        take(1),
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: (id) => {
          this.#router.navigateByUrl(`/${EVENT_ROUTING_BASE}/${id}`);
          this.#notificationService
            .open(this.isEditMode ? 'Изменения сохранены' : 'Мероприятие создано', {
              appearance: 'positive',
            })
            .subscribe();
        },
        error: (error: unknown) => {
          this.#notificationService
            .open(getApiErrorMessage(error, 'Не удалось сохранить мероприятие'), {
              appearance: 'negative',
            })
            .subscribe();
        },
      });
  }

  protected stringifyCategory(eventCategory: EventCategory): string {
    return eventCategory.name;
  }

  #fillForm(event: Event, categories: EventCategory[]): void {
    this.eventForm.patchValue({
      title: event.title,
      description: event.description ?? '',
      maxParticipants: event.maxParticipants,
      category: categories.find(({ id }) => id === event.categoryId) ?? null,
      startDate: toTuiDay(event.startDate),
      endDate: event.endDate ? toTuiDay(event.endDate) : TODAY,
      registrationDeadline:
        event.registrationDeadline ? toTuiDay(event.registrationDeadline) : TODAY,
      venue: event.venueId ? toVenueSuggestion(event.venueId) : null,
    });
    this.eventForm.controls.startDate.disable();
  }

  #buildCreateRequest(): CreateEventRequest {
    const { startDate } = this.eventForm.getRawValue();
    const { description, ...request } = this.#buildUpdateRequest();

    return { ...request, description: description ?? '', startDate: toIsoString(startDate) };
  }

  #buildUpdateRequest(): UpdateEventRequest {
    const { title, category, description, endDate, maxParticipants, registrationDeadline, venue } =
      this.eventForm.getRawValue();

    const original = this.editedEvent();

    return {
      title,
      categoryId: category?.id ?? '',
      description,
      endDate: keepOriginalTime(endDate, original?.endDate),
      registrationDeadline: keepOriginalTime(registrationDeadline, original?.registrationDeadline),
      maxParticipants,
      venueId: venue ? formatVenueAddress(venue) : null,
    };
  }
}

function toIsoString(day: TuiDay): string {
  return day.toUtcNativeDate().toISOString();
}

function keepOriginalTime(day: TuiDay | null, originalIsoDate?: string | null): string | null {
  if (!day) {
    return null;
  }

  if (originalIsoDate && toTuiDay(originalIsoDate).daySame(day)) {
    return originalIsoDate;
  }

  return toIsoString(day);
}

function toTuiDay(isoDate: string): TuiDay {
  return TuiDay.fromUtcNativeDate(new Date(isoDate));
}

function toVenueSuggestion(address: string): NominatimSuggestion {
  return { place_id: 0, display_name: address, lat: '', lon: '', address: {} };
}

function formatVenueAddress({ address, display_name }: NominatimSuggestion): string {
  const { house_number, road, city } = address;
  const street = [house_number, road].filter(Boolean).join(' ');

  return [street, city].filter(Boolean).join(', ') || display_name;
}

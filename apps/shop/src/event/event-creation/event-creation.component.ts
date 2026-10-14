import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CreateEventRequest,
  EventApiService,
  EventCategory,
  EventCategoryApiService,
  EventStatus,
  NominatimSuggestion,
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
import { TuiDataListWrapper, TuiInputDate, TuiSelect, TuiTextarea } from '@taiga-ui/kit';
import { take, tap } from 'rxjs';

import { EVENT_ROUTING_BASE } from '../consts';
import { InputVenueComponent } from './input-venue';

const TODAY = TuiDay.currentLocal();

@Component({
  selector: 'app-event-creation',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TuiButton,
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
  templateUrl: './event-creation.component.html',
  styleUrl: './event-creation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCreationComponent {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #destroyRef = inject(DestroyRef);
  readonly #eventCategoryService = inject(EventCategoryApiService);
  readonly #eventService = inject(EventApiService);
  readonly #notificationService = inject(TuiNotificationService);
  readonly #router = inject(Router);

  protected readonly EVENT_LIST_ROUTE = `/${EVENT_ROUTING_BASE}`;

  protected readonly eventForm = this.#fb.group({
    title: this.#fb.control('', Validators.required),
    category: this.#fb.control<EventCategory | null>(null, Validators.required),
    description: this.#fb.control(''),
    maxParticipants: this.#fb.control<number>(0),
    endDate: this.#fb.control(TODAY, Validators.required),
    registrationDeadline: this.#fb.control(TODAY, Validators.required),
    startDate: this.#fb.control(TODAY, Validators.required),
    status: this.#fb.control<EventStatus | null>(null),
    venue: this.#fb.control<NominatimSuggestion | null>(null, Validators.required),
  });

  protected readonly eventCategories = toSignal(
    this.#eventCategoryService.getAll().pipe(
      tap((categories) => {
        if (categories[0]) {
          this.eventForm.controls.category.setValue(categories[0]);
        }
      }),
    ),
    { initialValue: [] },
  );

  protected createEvent(): void {
    const {
      title,
      category,
      description,
      endDate,
      maxParticipants,
      registrationDeadline,
      startDate,
      venue,
    } = this.eventForm.getRawValue();

    if (!category || !startDate || !venue) {
      this.eventForm.updateValueAndValidity();
      return;
    }

    const request: CreateEventRequest = {
      title,
      categoryId: category.id,
      description,
      startDate: startDate.toUtcNativeDate().toISOString(),
      endDate: endDate ? endDate.toUtcNativeDate().toISOString() : null,
      registrationDeadline:
        registrationDeadline ? registrationDeadline.toUtcNativeDate().toISOString() : null,
      maxParticipants,
      venueId: formatVenueAddress(venue),
    };

    this.#eventService
      .create(request)
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#router.navigateByUrl(this.EVENT_LIST_ROUTE);
        this.#notificationService
          .open('Событие успешно создано', { appearance: 'positive' })
          .subscribe();
      });
  }

  protected stringifyCategory(eventCategory: EventCategory): string {
    return eventCategory.name;
  }
}

function formatVenueAddress({ address }: NominatimSuggestion): string {
  const { house_number, road, city } = address;
  const street = [house_number, road].filter(Boolean).join(' ');

  return [street, city].filter(Boolean).join(', ');
}

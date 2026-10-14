import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

import { EVENT_ROUTING_BASE } from '..';
import { InputVenueComponent } from './input-venue/input-venue.component';

const today = new Date();

const date = new TuiDay(today.getFullYear(), today.getMonth(), today.getDate());

@Component({
  selector: 'app-events-creation',
  imports: [
    ReactiveFormsModule,
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
  templateUrl: './events-creation.component.html',
  styleUrl: './events-creation.component.scss',
})
export class EventsCreationComponent {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #destroyRef = inject(DestroyRef);
  readonly #eventCategoryService = inject(EventCategoryApiService);
  readonly #eventService = inject(EventApiService);
  readonly #notificationService = inject(TuiNotificationService);
  readonly #router = inject(Router);

  protected readonly eventCategories = toSignal(
    this.#eventCategoryService.getAll().pipe(
      tap((value) => {
        if (value[0]) {
          this.eventCategoriesForm.controls.category.setValue(value[0]);
        }
      }),
    ),
    { initialValue: [] },
  );

  protected readonly eventCategoriesForm = this.#fb.group({
    title: this.#fb.control('', Validators.required),
    category: this.#fb.control<EventCategory | null>(null, Validators.required),
    description: this.#fb.control(''),
    maxParticipants: this.#fb.control<number>(0),
    endDate: this.#fb.control(date, Validators.required),
    registrationDeadline: this.#fb.control(date, Validators.required),
    startDate: this.#fb.control(date, Validators.required),
    status: this.#fb.control<EventStatus | null>(null),
    venue: this.#fb.control<NominatimSuggestion | null>(null, Validators.required),
  });

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
    } = this.eventCategoriesForm.getRawValue();

    if (!category || !startDate || !venue) {
      this.eventCategoriesForm.updateValueAndValidity();
      return;
    }

    const { house_number, road, city } = venue.address;
    const request: CreateEventRequest = {
      title,
      categoryId: category.id,
      description,
      startDate: startDate.toUtcNativeDate().toISOString(),
      endDate: endDate ? endDate.toUtcNativeDate().toISOString() : null,
      registrationDeadline:
        registrationDeadline ? registrationDeadline.toUtcNativeDate().toISOString() : null,
      maxParticipants,
      venueId: `${house_number && house_number} ${road && road}, ${city && city}`,
    };

    this.#eventService
      .create(request)
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#router.navigateByUrl(EVENT_ROUTING_BASE);
        this.#notificationService
          .open('Событие успешно создано', { appearance: 'positive' })
          .subscribe();
      });
  }

  protected stringifyCategory(eventCategory: EventCategory): string {
    return eventCategory.name;
  }
}

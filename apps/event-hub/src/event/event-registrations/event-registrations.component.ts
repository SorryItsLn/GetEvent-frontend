import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Event,
  Registration,
  RegistrationApiService,
  SetRegistrationStatusRequest,
  getApiErrorMessage,
} from '@myorg/modules';
import { TuiButton, TuiNotificationService } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { finalize, take } from 'rxjs';

import { REGISTRATION_STATUS_MANAGE_LABELS } from '../consts';

type DecisionStatus = SetRegistrationStatusRequest['status'];

const STATUS_ORDER: Record<Registration['status'], number> = {
  Waitlisted: 0,
  Confirmed: 1,
  Cancelled: 2,
};

@Component({
  selector: 'app-event-registrations',
  imports: [DatePipe, TuiButton, TuiButtonLoading],
  templateUrl: './event-registrations.component.html',
  styleUrl: './event-registrations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventRegistrationsComponent {
  readonly #registrationService = inject(RegistrationApiService);
  readonly #notificationService = inject(TuiNotificationService);
  readonly #destroyRef = inject(DestroyRef);

  readonly eventId = input.required<Event['id']>();

  protected readonly REGISTRATION_STATUS_MANAGE_LABELS = REGISTRATION_STATUS_MANAGE_LABELS;

  protected readonly registrations = computed(() =>
    this.#registrationService
      .registrationsEntities()
      .filter((registration) => registration.eventId === this.eventId())
      .sort(
        (a, b) =>
          STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
          new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime(),
      ),
  );

  protected readonly pendingDecision = signal<{
    id: Registration['id'];
    status: DecisionStatus;
  } | null>(null);

  protected getInitial(registration: Registration): string {
    return (registration.userName || registration.userEmail || 'У').charAt(0).toUpperCase();
  }

  protected decide(registration: Registration, status: DecisionStatus): void {
    if (this.pendingDecision()) {
      return;
    }

    this.pendingDecision.set({ id: registration.id, status });

    this.#registrationService
      .setStatus(registration.id, { status })
      .pipe(
        take(1),
        finalize(() => this.pendingDecision.set(null)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: () => {
          this.#notificationService
            .open(status === 'Confirmed' ? 'Заявка принята' : 'Заявка отклонена', {
              appearance: 'positive',
            })
            .subscribe();
        },
        error: (error: unknown) => {
          this.#notificationService
            .open(getApiErrorMessage(error, 'Не удалось изменить статус заявки'), {
              appearance: 'negative',
            })
            .subscribe();
        },
      });
  }
}

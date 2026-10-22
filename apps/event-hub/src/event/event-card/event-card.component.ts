import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event, EventCategory } from '@myorg/modules';
import { TuiIcon } from '@taiga-ui/core';

import {
  EVENT_CARD_TINTS,
  EVENT_ROUTING_BASE,
  EVENT_STATUS_LABELS,
  EventCardTint,
} from '../consts';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, RouterLink, TuiIcon],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  readonly event = input.required<Event>();
  readonly category = input<EventCategory>();
  readonly showStatus = input(false);
  readonly confirmedCount = input<number | null>(null);

  protected readonly EVENT_ROUTING_BASE = EVENT_ROUTING_BASE;
  protected readonly EVENT_STATUS_LABELS = EVENT_STATUS_LABELS;

  protected readonly tintClass = computed(() => `event-card_${getTint(this.event().categoryId)}`);
}

function getTint(categoryId: string): EventCardTint {
  const hash = [...categoryId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return EVENT_CARD_TINTS[hash % EVENT_CARD_TINTS.length];
}

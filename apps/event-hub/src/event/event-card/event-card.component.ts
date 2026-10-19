import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event, EventCategory } from '@myorg/modules';
import { TuiIcon } from '@taiga-ui/core';

import { EVENT_ROUTING_BASE } from '../consts';

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

  protected readonly EVENT_ROUTING_BASE = EVENT_ROUTING_BASE;
}

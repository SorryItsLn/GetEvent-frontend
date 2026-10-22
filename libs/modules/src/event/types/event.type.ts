import type { Paginated } from '@myorg/core';

export type EventStatus = 'Draft' | 'Published' | 'Cancelled' | 'Finished';

export type Event = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  venueId: string | null;
  categoryId: string;
  maxParticipants: number;
  registrationDeadline: string | null;
  organizerId: string;
  status: EventStatus;
};

export type GetEventByIdResponse = Event | null;

export type GetPaginatedEventsQuery = {
  page: number;
  pageSize: number;
  categoryId?: string;
  fromDate?: string;
};

export type GetPaginatedEventsResponse = Paginated<Event>;

export type MyEvent = Event & { pendingCount: number; confirmedCount: number };

export type GetMyEventsQuery = { page: number; pageSize: number };

export type GetMyEventsResponse = Paginated<MyEvent>;

export type CreateEventRequest = {
  title: string;
  description: string;
  startDate: string;
  categoryId: string;
  endDate: string | null;
  maxParticipants: number;
  registrationDeadline: string | null;
  venueId: string | null;
};

export type CreateEventResponse = string;

export type UpdateEventRequest = {
  title: string;
  categoryId: string;
  maxParticipants: number;
  description: string | null;
  registrationDeadline: string | null;
  endDate: string | null;
  venueId: string | null;
};

export type UpdateEventResponse = string;

export type SetEventStatusRequest = { status: EventStatus };

export type SetEventStatusResponse = string;

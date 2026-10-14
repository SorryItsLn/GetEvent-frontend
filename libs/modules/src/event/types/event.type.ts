// event.types.ts

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

export type Paginated<T> = { items: T[]; totalCount: number; page: number; pageSize: number };

// ---------- GET event/GetById/{id} ----------

export type GetEventByIdResponse = Event | null;

// ---------- GET event/GetPaginated ----------

export type GetPaginatedEventsQuery = {
  page: number;
  pageSize: number;
  categoryId?: string;
  fromDate?: string;
};

export type GetPaginatedEventsResponse = Paginated<Event>;

// ---------- POST event/Create ----------

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

export type CreateEventResponse = string; // Guid созданного мероприятия

// ---------- PUT event/Update/{id} ----------

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

// ---------- PUT event/SetStatus/{id} ----------

export type SetEventStatusRequest = EventStatus;

export type SetEventStatusResponse = string;

// ---------- Общий формат ошибки для всех эндпоинтов ----------

export type ApiErrorResponse = { error: string };

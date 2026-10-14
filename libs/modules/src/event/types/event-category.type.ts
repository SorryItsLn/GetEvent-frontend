export type EventCategory = { id: string; name: string; slug: string };

export type CreateEventCategoryRequest = { name: string; slug: string };

export type CreateEventCategoryResponse = string;

export type GetEventCategoryByIdResponse = EventCategory | null;

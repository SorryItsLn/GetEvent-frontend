export const EVENT_ROUTING_BASE = 'event';

export const EVENT_ROUTING_PARAMS = { ID: 'id' } as const;

export const EVENT_ROUTING_LINKS = {
  MAIN_PAGE: '',
  CREATION: 'create',
  DETAILS: `:${EVENT_ROUTING_PARAMS.ID}`,
} as const;

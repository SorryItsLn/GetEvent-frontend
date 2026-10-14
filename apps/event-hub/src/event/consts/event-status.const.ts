import type { EventStatus } from '@myorg/modules';

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  Draft: 'Черновик',
  Published: 'Опубликовано',
  Cancelled: 'Отменено',
  Finished: 'Завершено',
};

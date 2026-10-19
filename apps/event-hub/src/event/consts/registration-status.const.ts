import type { RegistrationStatus } from '@myorg/modules';

export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  Confirmed: 'Вы записаны',
  Waitlisted: 'Вы в листе ожидания',
  Cancelled: 'Запись отменена',
};

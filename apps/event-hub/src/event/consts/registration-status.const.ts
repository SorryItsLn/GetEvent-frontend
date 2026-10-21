import type { RegistrationStatus } from '@myorg/modules';

export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  Confirmed: 'Вы записаны',
  Waitlisted: 'Заявка ожидает подтверждения',
  Cancelled: 'Заявка отклонена',
};

export const REGISTRATION_STATUS_MANAGE_LABELS: Record<RegistrationStatus, string> = {
  Waitlisted: 'Ожидает',
  Confirmed: 'Принята',
  Cancelled: 'Отклонена',
};

export type RegistrationStatus = 'Confirmed' | 'Cancelled' | 'Waitlisted';

export type Registration = {
  id: string;
  eventId: string;
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  status: RegistrationStatus;
  registeredAt: string;
  cancelledAt: string | null;
};

export type CreateRegistrationRequest = { eventId: string };

export type CreateRegistrationResponse = string;

export type SetRegistrationStatusRequest = { status: Exclude<RegistrationStatus, 'Waitlisted'> };

export type SetRegistrationStatusResponse = string;

export type CountActiveRegistrationsResponse = number;

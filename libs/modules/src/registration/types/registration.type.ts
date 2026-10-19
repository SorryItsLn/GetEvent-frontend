export type RegistrationStatus = 'Confirmed' | 'Cancelled' | 'Waitlisted';

export type Registration = {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  registeredAt: string;
  cancelledAt: string | null;
};

export type CreateRegistrationRequest = { eventId: string; userId: string };

export type CreateRegistrationResponse = string;

export type CountActiveRegistrationsResponse = number;

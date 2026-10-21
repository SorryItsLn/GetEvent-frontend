import type { Event, User } from '@myorg/modules';

export function canManageEvent(event: Event, user: User | null): boolean {
  if (!user) {
    return false;
  }

  return user.roles.includes('Admin') || event.organizerId === user.id;
}

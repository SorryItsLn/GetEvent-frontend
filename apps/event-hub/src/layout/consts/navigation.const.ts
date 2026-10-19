import { EVENT_ROUTING_BASE } from '../../event/consts';
import { HOME_ROUTING_BASE } from '../../home/consts';
import { REGISTRATION_ROUTING_BASE } from '../../registration/consts';
import { USER_ROUTING_BASE, USER_ROUTING_LINKS } from '../../user/consts';

export type NavigationItem = { icon: string; route: string; name: string };

export const HOME_ROUTE = `/${HOME_ROUTING_BASE}`;
export const USER_PROFILE_ROUTE = `/${USER_ROUTING_BASE}/${USER_ROUTING_LINKS.ME}`;

export const MAIN_NAVIGATION: NavigationItem[] = [
  { icon: '@tui.calendar', route: `/${EVENT_ROUTING_BASE}`, name: 'Мероприятия' },
  { icon: '@tui.square-check-big', route: `/${REGISTRATION_ROUTING_BASE}`, name: 'Мои записи' },
];

export const TAB_BAR_NAVIGATION: NavigationItem[] = [
  { icon: '@tui.house', route: HOME_ROUTE, name: 'Главная' },
  ...MAIN_NAVIGATION,
  { icon: '@tui.user', route: USER_PROFILE_ROUTE, name: 'Профиль' },
];

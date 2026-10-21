export const EVENT_LIST_PAGE_SIZES = [12, 24, 48] as const;

export const EVENT_LIST_DEFAULT_PAGE_SIZE = EVENT_LIST_PAGE_SIZES[0];

export const EVENT_LIST_PAGE_QUERY_PARAM = 'page';

export const EVENT_LIST_SIZE_QUERY_PARAM = 'size';

export const EVENT_COUNT_PLURAL: Record<string, string> = {
  '=0': 'Мероприятий нет',
  one: '# мероприятие',
  few: '# мероприятия',
  many: '# мероприятий',
  other: '# мероприятия',
};

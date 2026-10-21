export const AUTH_FEATURES = [
  { icon: '@tui.calendar-days', text: 'Афиша встреч по интересам: от настолок до митапов' },
  { icon: '@tui.circle-check', text: 'Запись в пару кликов с подтверждением организатора' },
  { icon: '@tui.users', text: 'Создавайте свои мероприятия и собирайте участников' },
] as const;

export const AUTH_PREVIEW_EVENTS = [
  { tint: 'sage', category: 'Настолки', title: 'Вечер настольных игр', month: 'нояб.', day: 14 },
  {
    tint: 'amber',
    category: 'Митап',
    title: 'Frontend-митап: Angular 22',
    month: 'нояб.',
    day: 21,
  },
  { tint: 'plum', category: 'Спорт', title: 'Утренняя пробежка в парке', month: 'нояб.', day: 23 },
] as const;

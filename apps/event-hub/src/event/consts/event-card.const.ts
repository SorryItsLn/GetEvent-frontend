export const EVENT_CARD_TINTS = ['coral', 'sage', 'amber', 'plum'] as const;

export type EventCardTint = (typeof EVENT_CARD_TINTS)[number];

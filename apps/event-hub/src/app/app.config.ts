import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';
import { TUI_LANGUAGE } from '@taiga-ui/i18n';
import { TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n/languages/russian';

import { appRoutes } from './app.routes';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideTaiga(),
    provideRouter(appRoutes),
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: TUI_LANGUAGE, useValue: signal(TUI_RUSSIAN_LANGUAGE) },
  ],
};

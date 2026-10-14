<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# Стандарты кода проекта

Команды запускаются через `bun nx` (`bun nx run-many -t lint,test,build`). Перед коммитом всё должно быть зелёным, а `bunx prettier --check apps libs` — чистым.

## Структура воркспейса

- `apps/shop` — приложение. Фичи: `auth`, `home`, `user`, `event`, плюс `layout` и `not-found`.
- `libs/core` (`@myorg/core`) — инфраструктура: `ApiGateway`, `CookieService`, `LocalStorageService`, утилиты стора, общие типы (`Paginated`, `ApiErrorResponse`).
- `libs/modules` (`@myorg/modules`) — доменные API-сервисы, гарды и типы: `auth`, `event`, `nominatim`, `registration`, `user`, `venue`.
- `libs/shared-ui` (`@myorg/shared-ui`) — переиспользуемые UI-утилиты (`FormControlWrapper`).
- Границы модулей (`@nx/enforce-module-boundaries`): `modules` зависит только от `core`; приложение — от `modules` и `shared`.

## Именование

- Домены и фичи называются в **единственном числе**: `event`, `user`, `registration`.
- Папка компонента совпадает с именем файла: `event-list/event-list.component.ts` → `EventListComponent`, селектор `app-event-list` (в либах префикс `lib`).
- Файлы: `*.component.ts`, `*.service.ts`, `*.guard.ts`, `*.routes.ts`, `*.const.ts`, `*.type.ts`, `*.spec.ts`.
- В каждой папке есть `index.ts`. Импорты идут через barrel (`'../consts'`, `'../../user/consts'`), а не в конкретный файл.
- Константы — `UPPER_SNAKE_CASE`, в том числе поля компонента, которые используются в шаблоне (`protected readonly EVENT_LIST_ROUTE`).

## Библиотека `modules`

Структура домена:

```
event/
  consts/        event.const.ts + index.ts
  types/         event.type.ts + index.ts
  event.service.ts
  index.ts
```

- API-сервис называется `<Domain>ApiService` (исключение — `AuthService`). Декоратор — `@Service()`, а не `@Injectable`.
- Сервис, который хранит данные, наследуется от `signalStore({ protectedState: false }, ...)`. Для коллекций используется `withEntities` + `entityConfig`, данные складываются через `updateStoreEntity` / `updateStoreEntities` из `@myorg/core`.
- Запросы к бэкенду идут только через `ApiGateway`, путь собирается из `readonly #baseUrl = '<controller>'`: `` `${this.#baseUrl}/GetById/${id}` ``. `HttpClient` напрямую используется только для внешних API (`nominatim`).
- Типы называются по схеме `<Action><Entity>Request` / `<Action><Entity>Response` / `<Action><Entity>Query` (`CreateEventRequest`, `GetEventByIdResponse`). Методы возвращают `Observable<...Response>`.
- id в параметрах типизируются через сущность: `getById(id: Event['id'])`.

## Приложение `shop`

Структура фичи:

```
event/
  consts/              event-routing.const.ts + index.ts
  event-list/          event-list.component.{ts,html,scss} + index.ts
  event-details/
  event.routes.ts      export const eventRoutes: Routes
  index.ts             export * from './consts'; export * from './event.routes';
```

- Роутинг только standalone: `Routes` + `loadChildren` / `loadComponent`, без `NgModule`. Компоненты подключаются лениво через их `index.ts`.
- Пути не хардкодятся. У каждой фичи есть `<FEATURE>_ROUTING_BASE` и `<FEATURE>_ROUTING_LINKS` (и `<FEATURE>_ROUTING_PARAMS` для параметров). Абсолютный путь собирается как `` `/${EVENT_ROUTING_BASE}` ``.
- Для навигации в шаблоне используется `<a routerLink>` (в том числе с `tuiButton`), а не `(click)` + `router.navigateByUrl`. `navigateByUrl` — только после действия (логин, создание сущности).
- UI-тексты на русском. Человекочитаемые подписи для enum-ов лежат в `consts` фичи (`EVENT_STATUS_LABELS`).

## Компоненты

- Все компоненты standalone с `changeDetection: ChangeDetectionStrategy.OnPush`. Приложение zoneless — состояние держим в сигналах.
- Порядок полей в `@Component`: `selector`, `imports`, `templateUrl`, `styleUrl`, `changeDetection`.
- Порядок членов класса:
  1. зависимости: `readonly #service = inject(Service)`;
  2. приватное состояние (`readonly #model = signal(...)`);
  3. константы для шаблона (`protected readonly UPPER_CASE`);
  4. сигналы/формы для шаблона (`protected readonly ...`);
  5. `constructor`;
  6. `protected` методы, которые вызываются из шаблона, затем приватные `#method()`.
- Модификатор `private` запрещён (lint) — только нативные `#field` / `#method`. Всё, что получено через `inject()`, — `readonly`. Всё, что используется только шаблоном, — `protected`.
- Подписки закрываются через `takeUntilDestroyed(this.#destroyRef)` (для одиночных запросов — плюс `take(1)`). Данные для отображения получаются через `toSignal(...)`.
- Загрузка, которая нужна только в браузере, выполняется в `afterNextRender(...)`.
- У методов указывается тип возврата (`: void`, `: string`, `: Observable<...>`).
- `console.log` запрещён (разрешены `console.warn` / `console.error`).

## Шаблоны и стили

- Только новый control flow: `@if`, `@for` (`track` по id, а не `$index`), `@let`.
- Пустые элементы самозакрывающиеся: `<app-header />`, `<router-outlet />`. Исключение — `index.html`, там самозакрывающиеся теги не поддерживаются.
- Стили только в `.scss`, классы по BEM (`.block__element`, модификатор `_mod`). Корневой класс шаблона совпадает с именем компонента (`.event-list`).
- Цвета, радиусы и отступы берутся из CSS-переменных (`var(--surface)`, `var(--radius)`), типографика — из миксинов `@use 'typography'`.
- Формат кода определяет prettier (`prettier.config.mjs`): сортировка импортов и атрибутов, порядок CSS-свойств. Руками это не выравниваем.

## Тесты

- Vitest + Analog, файл `*.spec.ts` лежит рядом с исходником; `describe` называется по имени класса.
- Компоненты с `routerLink` / `ActivatedRoute` тестируются с `providers: [provideRouter([])]`.
- Сервисы — через `TestBed.inject(...)`, базовые директивы — через тестовый компонент-наследник.

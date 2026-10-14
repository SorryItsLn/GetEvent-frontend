# Event HUB

Фронтенд сервиса мероприятий: просмотр, создание мероприятий и запись на них. Nx-монорепозиторий на Angular 22 + Taiga UI, бэкенд — .NET API (подключается через прокси).

## Проекты

- `event-hub` (`apps/event-hub`) — Angular-приложение.
- `core` (`@myorg/core`) — инфраструктура: `ApiGateway`, cookie, localStorage, утилиты стора.
- `modules` (`@myorg/modules`) — доменные API-сервисы, гарды и типы.
- `shared-ui` (`@myorg/shared-ui`) — переиспользуемые UI-утилиты.

Стандарты кода и структура проекта описаны в [AGENTS.md](AGENTS.md).

## Запуск

```bash
bun install

# адрес бэкенда для прокси /api (пример; см. apps/event-hub/proxy.conf.mjs)
export API_URL=http://localhost:5000

bun run start
```

## Команды

```bash
bun nx run event-hub:serve         # dev-сервер
bun nx run event-hub:build         # сборка приложения
bun nx run-many -t lint,test,build # проверить всё
bun nx graph                       # граф зависимостей
```

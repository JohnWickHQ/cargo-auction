# Cargo Auction SPA

Одностраничное приложение для работы с грузовыми аукционами. Список аукционов с
фильтрацией и пагинацией, детальная карточка, история ставок, размещение ставки.
Бэкенд не нужен — API замокан через MSW.

## Требования

- Node.js >= 20.18.0
- npm >= 10.0.0

## Быстрый старт

```bash
git clone <repo-url> cargo-auction
cd cargo-auction
npm install
npm run dev
```

Открыть [http://localhost:5173/auctions](http://localhost:5173/auctions).

## Команды

| Команда                | Назначение                                                     |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Dev-сервер на localhost:5173                                   |
| `npm test`             | Unit-тесты (Vitest, 96 тестов)                                 |
| `npm run test:e2e`     | e2e-тесты (Playwright)                                         |
| `npm run build`        | Production-сборка в `dist/`                                    |
| `npm run lint`         | ESLint (type-aware, 0 ошибок)                                  |
| `npm run typecheck`    | Проверка TypeScript (strict)                                   |
| `npm run coverage`     | Покрытие тестами (text + HTML)                                 |
| `npm run knip`         | Мёртвый код / неиспользуемые зависимости (0 issues)            |
| `npm run format`       | Prettier — форматировать                                       |
| `npm run format:check` | Prettier — проверить                                           |
| `npm run finish`       | Полный прогон: lint → typecheck → test → format → knip → build |

## Стек

| Слой          | Технология            |
| ------------- | --------------------- |
| Фреймворк     | React 19              |
| Язык          | TypeScript (strict)   |
| Сборщик       | Vite 6                |
| UI-библиотека | Mantine v7            |
| Роутинг       | TanStack Router v1    |
| Данные        | TanStack Query v5     |
| Формы         | React Hook Form + Zod |
| API-моки      | MSW v2                |
| Состояние     | Zustand v5            |
| Тесты         | Vitest + Playwright   |
| Линтер        | ESLint (flat config)  |
| Форматтер     | Prettier              |
| Гигиена       | Knip                  |

## Структура проекта

```text
src/
├── app/            # Точка входа, провайдеры (Mantine, Query, MSW, Router)
├── pages/          # AuctionListPage, AuctionDetailPage
├── widgets/        # auction-filters, auction-table, auction-card, bet-list, bet-form
├── features/       # filter-auctions (Zod + URL-синхронизация), set-bet (схема формы)
├── entities/       # auction (API, хуки), bet (API, хуки, mutation)
└── shared/         # API-клиент, MSW-хендлеры (store + seed), конфигурация, типы, UI, Zustand-стор
```

Feature-Sliced Design: внутренние слои не могут импортировать из внешних. `@/` → `src/`.

## API (замокано через MSW)

Все запросы перехватываются MSW в браузере. Бэкенд-сервер не требуется.

| Метод | Путь                          | Описание                      |
| ----- | ----------------------------- | ----------------------------- |
| POST  | `/api/v1/auctions/list`       | Список аукционов с пагинацией |
| GET   | `/api/v1/auctions/:uuid`      | Детальная информация          |
| GET   | `/api/v1/auctions/:uuid/bets` | История ставок                |
| POST  | `/api/v1/auctions/:uuid/bets` | Разместить ставку             |

75 seed-аукционов со сгенерированными данными.

## Перед коммитом

Husky + lint-staged запускается автоматически на `git commit`. Перед коммитом
всегда выполняй `npm run finish` — проект должен быть в рабочем состоянии без
блокирующих ошибок.

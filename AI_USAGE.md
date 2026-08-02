# AI Usage in Cargo Auction SPA

## Какие части делались с AI

- Первичная имплементация: scaffold, типы, DTO, MSW-хендлеры, TanStack Query хуки, страницы, роутинг (18 задач через subagent-driven)
- Рефакторинг компонентов: разбиение AuctionCard на PriceBand/RouteInfo/CargoInfo/OrganizerInfo, выделение DesktopRow и MobileCard
- Написание unit-тестов (103 теста: схемы, хендлеры, API-клиент, view-мапперы, bet-logic)
- Написание e2e-тестов (Playwright: открытие списка, форма ставки)
- Настройка ESLint (type-aware flat config), Prettier, Knip, pre-commit хуков
- Исправление багов (кратность шага, ранжирование ставок, сброс фильтров, плавающая точка, FixPrice логика, Draft аукционы)
- Создание проектной документации (AGENTS.md, ARCHITECTURE.md)

## Итерационные улучшения с AI

После первичной реализации проект прошёл через 4 сессии последовательного улучшения:

### 1. FSD v2.1 «Pages First» реструктуризация (bd45396)

- Удалены слои `widgets/`, `features/`, `entities/bet/`, `shared/lib/` — логика перенесена в `pages/`
- Сплит `shared/types/dto.ts` → `auction.ts` + `bet.ts`
- Мерж `shared/types/enums.ts` → `auction.ts`, лейблы в `shared/config/labels.ts`
- Вынесен `getBetAction` в `shared/config/bet-actions.ts`
- Обновлён ARCHITECTURE.md под новую структуру

### 2. Vercel React Best Practices (bd45396)

- `React.memo` на 10 презентационных компонентах (DesktopRow, MobileCard, RouteInfo, CargoInfo, OrganizerInfo, PriceBand, RoutePointTable, AuctionCardContent, CitySelect, ColorSchemeToggle)
- `SuspenseBoundary` (Suspense + ErrorBoundary + QueryErrorResetBoundary) — замена ручных isLoading/isError-веток
- Переход на `useSuspenseQuery` для AuctionList, AuctionDetail, Bets
- 12 последовательных `.filter()` → один проход `for`-циклом в `filter-auctions.ts`
- `useTransition` + `startTransition` для навигации фильтров
- Lazy-load `@mantine/dates` через `React.lazy`
- LRU-кеш `formatPrice` через `Map<number, string>`
- `content-visibility: auto` для строк таблицы аукционов
- Lazy-init MSW store (`getStore` паттерн)
- Извлечение `bet-logic.ts` из инлайн-кода хендлеров
- Стабилизация `AuctionListRequest` через `useMemo` в AuctionTable
- Вынесение `MswSpinner` из тела `MswProvider`
- Исправление conditional render: `<></>` → `null`

### 3. Architecture review — архитектурные улучшения (594f80a)

- Дубликат `uuid()` устранён → `shared/lib/id.ts`, импорт из `seed.ts`
- Валидация `validateBetPrice` вынесена в `shared/lib/bet-validation.ts`, переиспользована в `bet-form.schema.ts` через `superRefine`
- `AuctionTypeValues`/`AuctionStatusValues` перенесены из `shared/types/` в `shared/config/auction-constants.ts`
- Лейбл/цветовые мапы затипизированы: `Record<string,string>` → `Record<AuctionType,string>` и т.д.
- Убрано 9 `!` assertions и 6 `??` fallbacks благодаря compile-time exhaustiveness
- Компоненты `RouteInfo`, `CargoInfo`, `OrganizerInfo`, `PriceBand`, `RoutePointTable` принимают узкие пропсы вместо полного `AuctionDetail`
- `ARCHITECTURE.md`: цепочка зависимостей дополнена слоем `routes/`

### 4. TypeScript improvements — типобезопасность (b0a2441)

- `getBetAction`: `primaryAction: string` → `PrimaryAction` с exhaustive switch
- `rankBets`: `aucType: string` → `AuctionType`
- `BetForm`: убран `v as never`, вынесен `getDefaultPrice` с exhaustive switch
- MSW handlers: Zod-валидация `request.json()` через `auctionListRequestSchema` / `setBetRequestSchema`
- `bet.hooks.ts`: `error.body as ValidationError` → `isValidationError()` type guard
- Убраны мёртвые `!auction` / `!data` проверки после `useSuspenseQuery`
- Убраны `?? ""` и лишние `!== undefined` проверки
- `handlers.ts`: `as string` заменено на `Array.isArray` runtime-проверку
- Локальные интерфейсы заменены на импорт из `@/shared/types` (RoutePoint, Contact, Trading)
- `DatePickerInput`: `Record<string,unknown>` → typed props
- `main.tsx`: guard с сообщением вместо `!`
- `filter-auctions.ts`: `for...of` вместо индексированного цикла с `!`
- `seed.ts`: `pick()` с runtime-проверкой, убраны 6 `!` на вызовах
- `formatDate()` утилита → заменено 5 повторяющихся `toLocaleDateString`
- `orUndefined()` / `toDateFilter()` helpers
- `DetailSearch` тип вместо `Record<string, unknown>` в search-параметрах

### 5. Code review — баги, иммутабельность, обработка ошибок (0fa8e4c)

- **C1**: `SuspenseBoundary` затирал ошибку `new Error("")` → `errorFallback(error, reset)`
- **C2**: `rankBets` мутировал оригинальные объекты `Bet` → `cloneBet()` — возврат новых объектов
- **C3**: Бесконечный спиннер при падении `initMsw()` → `.catch()` с `setReady(true)`
- **H1-H10**: `validateBetPrice` не работал с `0` (falsy), `isValidationError` type guard, синхронизация `local` state с URL, guard от `betStep=0`, `resetStore()` для тестов, `parseFilters()` pure function, `filtersToRequestParams()` утилита, именованные константы в `seed.ts`, `useCallback` для submit handler
- **M1-M8**: `key` по данным вместо индекса, `useCallback` для fallback'ов, `hasActive` для пустых массивов, `isMultipleOf()` helper, `useMemo` для `defaultPrice`

## Какие решения кандидат принял сам

- На начальном этапе, для анализа требований и первичной имплементации SDD фреймворк Superpowers
- Развертывание инфраструктуры для AI (AGENTS.md, ARCHITECTURE.md)
- Использование Mantine как UI библиотеки
- Добавление unit тестов на критический функционал
- Добавление e2e Playwright тестов
- Добавление тёмной темы

- Далее у меня есть самописный гайд для LLM `docs/project-baseline.md`
  Он описывает разворачивание TypeScript + React проектов: структура кодовой базы,
  обязательные библиотеки (Vitest, ESLint, Prettier, Knip), тестовый baseline, чеклист для greenfield-бутстрапа
  или фазы доапгрейда существующего проекта.
  Обычно я стартую проект с него, но в данном проекте в качестве эксперимента я решил сначала сделать первичную
  реализацию, а потом уже итерационно улучшать кодовую базу. Т.к. бывают задачи, когда кодовая база уже есть и ее нужно
  сделать удобной как для человека так и для LLM.

## Какие AI-предложения были отклонены

- Слишком мягкие проверки кодовой базы. LLM считает что для проекта такого уровня достаточно минимальных проверок. Я
  считаю, что даже на старте проекта нужно проверять жестче. Больше тестов, больше ограничений линтеров. Иначе при
  дальнейшем развитии проекта тех. долг будет увеличиваться очень быстро и будет потерян контроль над кодовой базой.
- LLM предлагал упростить логику ранжирования ставок (убрать сортировку) — отклонено, реализована полноценная сортировка
- LLM предлагал не использовать `exactOptionalPropertyTypes` из-за конфликтов с Mantine — решено включить и исправить
- LLM предлагал оставить `warn` уровень для ESLint-правил сложности — переведено в `error`

## Какие места кандидат проверял особенно внимательно

- Проверка бизнес-логики работы аукциона. Различные граничные варианты. Например, если аукцион недоступен,
  кнопка изменить ставку должна быть неактивна
- Фикс ошибок. Есть тип аукциона фиксированный. Он недоступен. Если цена фиксированная, кто первый согласился, тот
  и выиграл. Такое поведение будет правильным.
- Валидация кратности шагу ставки (Zod + MSW): несколько итераций отладки, unit + e2e тесты
- Ранжирование победителя в аукционе: сортировка по цене, отменённые ставки исключаются
- Сброс фильтров: merge vs replace в URL-параметрах
- Тёмная тема: интеграция с Mantine v7, корректная работа `useMantineColorScheme`
- Навигация «Смотреть ставки» и «Сделать ставку» — через query-параметры
- ESLint strict rules: каждый файл проверен на соответствие `complexity ≤ 12`, `max-lines ≤ 250`

## Что было сделано сверх запланированного во время итерационных улучшений

- FSD v2.1 реструктуризация — удаление 4 слоёв, консолидация в pages-first
- 10+ Vercel React Best Practices внедрено (Suspense, memo, lazy loading, transitions)
- 9 архитектурных находок исправлено (дедупликация, типизированные лейблы, narrow props)
- 21 TypeScript находка исправлена (union types, Zod validation, type guards, dead code)
- 38 находок code review исправлено (3 критических бага, 10 high, 8 medium + helpers)
- `knip` доведён до 0 issues и 0 hints
- ErrorBoundary добавлен в рамках `SuspenseBoundary`
- Частичное code-splitting: `@mantine/dates` lazy-loaded

## Какие риски остались

- 2 e2e-теста пропускаются (bet-winner, first-bet) — нужна доработка тестовой инфраструктуры
- Покрытие unit-тестами — UI компоненты тестируются только через e2e
- Нет интеграции с реальным бэкендом — только MSW-моки
- Размер бандла ~700 KB (~214 KB gzip) — основной чанк без code-splitting по роутам
- Нет CI/CD pipeline

## Что бы кандидат улучшил при наличии ещё одного дня

- Починить пропущенные e2e-тесты (bet-winner, first-bet)
- Добавить React Testing Library тесты для критичных компонентов (BetForm, AuctionFilters)
- Code-splitting по роутам для уменьшения бандла
- CI pipeline (GitHub Actions): lint → typecheck → test → build
- i18n инфраструктуру для всех строк интерфейса
- Branded types для доменных примитивов (Uuid, Rubles) — предложено LLM, отложено

# Architecture — Cargo Auction SPA

## Overview

Single-page application for cargo auctions. Frontend-only with MSW-mocked API.

## Stack

| Concern      | Choice                    |
| ------------ | ------------------------- |
| Framework    | React 19                  |
| Bundler      | Vite 6                    |
| Router       | TanStack Router v1        |
| Server state | TanStack Query v5         |
| Client state | Zustand v5                |
| UI           | Mantine v7                |
| Forms        | React Hook Form 7 + Zod 3 |
| API mock     | MSW v2                    |
| Tests        | Vitest + Playwright       |

## Module Structure (Feature-Sliced Design)

```
src/
├── app/            # Entry point, providers (Mantine, Query, MSW, Router)
├── pages/          # AuctionListPage, AuctionDetailPage
├── widgets/        # auction-filters, auction-table (includes DesktopRow, MobileCard), auction-card (includes PriceBand, RouteInfo, CargoInfo, OrganizerInfo), bet-list, bet-form
├── features/       # filter-auctions (Zod + URL sync), set-bet (form schema)
├── entities/       # auction (API, hooks), bet (API, hooks, mutation)
└── shared/         # API client, MSW handlers (store/seed/handlers), config, types, UI wrappers, Zustand store
```

Import direction: inner layers cannot import from outer layers. `@/` → `src/`.

## Data Flow

```
URL search params ──→ Zod schema (safeParse) ──→ TanStack Query hooks
                                                        ↓
                                                  MSW handlers (in-memory store)
                                                        ↓
                                                  React components (Mantine)
```

- **URL** is source of truth for filters
- **TanStack Query** manages server state (auctions, auction detail, bets)
- **Zustand** handles UI-only state (active tab, bet form visibility)
- **MSW** intercepts fetch, operates on in-memory Map-based store

## Routes

| Route                    | Page                   | Query Params         |
| ------------------------ | ---------------------- | -------------------- |
| `/`                      | Redirect → `/auctions` | —                    |
| `/auctions`              | AuctionListPage        | All 11 filter params |
| `/auctions/$auctionUuid` | AuctionDetailPage      | `tab`, `action`      |

## API Endpoints (MSW-mocked)

| Method | Path                          | Description                       |
| ------ | ----------------------------- | --------------------------------- |
| POST   | `/api/v1/auctions/list`       | Filtered + paginated auction list |
| GET    | `/api/v1/auctions/:uuid`      | Auction detail                    |
| GET    | `/api/v1/auctions/:uuid/bets` | Bet history                       |
| POST   | `/api/v1/auctions/:uuid/bets` | Place a bet                       |

## Key Invariants

- Seed data prices are snapped to `bet_step` boundaries (`Math.round(v/step) * step`)
- Bet ranking: highest price wins for Up/Request, lowest for Down
- Cancelled bets are excluded from ranking
- `current_price` always reflects the winning bet's price
- `no_view_cargo_price=true` means `current_price=0` — bets not generated

## Quality Gates

| Gate      | Command                | Level                                                              |
| --------- | ---------------------- | ------------------------------------------------------------------ |
| Lint      | `npm run lint`         | ESLint type-aware, 0 errors required                               |
| TypeCheck | `npm run typecheck`    | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` |
| Tests     | `npm test`             | Vitest, 96 unit tests                                              |
| E2E       | `npm run test:e2e`     | Playwright, 2 specs                                                |
| Format    | `npm run format:check` | Prettier                                                           |
| Dead code | `npm run knip`         | Knip, 0 issues required                                            |
| Build     | `npm run build`        | Vite, must succeed                                                 |
| Full      | `npm run finish`       | All of the above combined                                          |

## Component File Conventions

- Large widgets decomposed into separate files in the same `ui/` directory:
  - `auction-table/ui/` → `AuctionTable`, `DesktopRow`, `MobileCard`
  - `auction-card/ui/` → `AuctionCard` (orchestrator), + `PriceBand`, `RouteInfo`, `CargoInfo`, `OrganizerInfo` (sub-components)
- Sub-components not exported from widget barrel unless used externally

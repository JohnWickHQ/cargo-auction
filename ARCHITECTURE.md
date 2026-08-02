# Architecture — Cargo Auction SPA

## Overview

Single-page application for cargo auctions. Frontend-only with MSW-mocked API.
Follows FSD v2.1 with minimal layers: `app/` + `pages/` + `entities/` + `shared/`.

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

## Module Structure (Feature-Sliced Design v2.1)

```
src/
├── app/            # Entry point, providers (Mantine, Query, MSW, Router)
├── routes/         # TanStack Router route definitions
├── pages/          # Page-level composition + all page-owned logic
│   ├── auction-list/       # AuctionListPage, filters, table, pagination, filter schema
│   └── auction-detail/     # AuctionDetailPage, auction card, bet form, bet list, bet logic
├── entities/       # Reusable domain models (used by 2+ pages)
│   └── auction/            # Auction API, hooks, types (shared by both pages)
└── shared/         # Infrastructure with no business logic
    ├── api/            # Fetch client, MSW handlers, store, seed, bet-logic, filter-auctions
    ├── config/         # Constants, cities, labels, formatPrice
    ├── types/          # auction.ts (core types + enums), bet.ts (bet types + validation errors)
    └── ui/             # CitySelect, ColorSchemeToggle
```

**Import direction**: `app → routes → pages → entities → shared`. No `widgets/` or `features/` layers — single-page components and single-consumer logic live in their owning pages (FSD v2.1 «Pages First» principle).

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
- **Zustand** handles UI-only state (active tab, bet form visibility) — co-located with page
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
| Tests     | `npm test`             | Vitest, 103 unit tests (12 files)                                  |
| E2E       | `npm run test:e2e`     | Playwright, 2 specs                                                |
| Format    | `npm run format:check` | Prettier                                                           |
| Dead code | `npm run knip`         | Knip, 0 issues required                                            |
| Build     | `npm run build`        | Vite, must succeed                                                 |
| Full      | `npm run finish`       | All of the above combined                                          |

## Component File Conventions

- All React components end with `*.component.tsx`
- Large components decomposed into separate files in the same `ui/` directory:
  - `pages/auction-detail/ui/` → `AuctionCard`, `AuctionCardContent`, `PriceBand`, `RouteInfo`, `CargoInfo`, `OrganizerInfo`, `RoutePointTable`, `BetList`, `BetForm`
  - `pages/auction-list/ui/` → `AuctionFilters`, `AuctionTable`, `DesktopRow`, `MobileCard`
- Sub-components not exported from page barrel unless used externally

## Shared Types

Domain-split naming (FSD v2.1 Rule 4-4):

- `shared/types/auction.ts` — `AuctionListItem`, `AuctionDetail`, request/response types, enum unions
- `shared/types/bet.ts` — `Bet`, `BetsResponse`, `SetBetRequest/Response`, `ValidationError`

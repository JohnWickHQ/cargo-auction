# Cargo Auction SPA

Single-page application for cargo auctions: auction list with filtering and pagination,
detail card, bet history, and bet placement. No backend needed — API mocked via MSW.

## Prerequisites

- Node.js >= 20.18.0
- npm >= 10.0.0

## Quick Start

```bash
git clone https://github.com/JohnWickHQ/cargo-auction.git
cd cargo-auction
npm install
npm run dev
```

Open [http://localhost:5173/auctions](http://localhost:5173/auctions).

## Commands

| Command                | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Dev server at localhost:5173                                   |
| `npm test`             | Unit tests (Vitest, 103 tests)                                 |
| `npm run test:e2e`     | e2e tests (Playwright)                                         |
| `npm run build`        | Production build to `dist/`                                    |
| `npm run lint`         | ESLint (type-aware, 0 errors required)                         |
| `npm run typecheck`    | TypeScript type check (strict)                                 |
| `npm run coverage`     | Test coverage report (text + HTML)                             |
| `npm run knip`         | Dead code / unused dependency check (0 issues)                 |
| `npm run format`       | Prettier — write                                               |
| `npm run format:check` | Prettier — check                                               |
| `npm run finish`       | Full pipeline: lint → typecheck → test → format → knip → build |

## Stack

| Layer      | Technology            |
| ---------- | --------------------- |
| Framework  | React 19              |
| Language   | TypeScript (strict)   |
| Bundler    | Vite 6                |
| UI Library | Mantine v7            |
| Router     | TanStack Router v1    |
| Data       | TanStack Query v5     |
| Forms      | React Hook Form + Zod |
| API Mock   | MSW v2                |
| State      | Zustand v5            |
| Testing    | Vitest + Playwright   |
| Linting    | ESLint (flat config)  |
| Formatting | Prettier              |
| Hygiene    | Knip                  |

## Project Structure

```text
src/
├── app/            # Entry point, providers (Mantine, Query, MSW, Router)
├── routes/         # TanStack Router route definitions
├── pages/          # Pages: auction-list, auction-detail
├── entities/       # Reusable domain models: auction (API, hooks)
└── shared/         # Infrastructure: API client, MSW (handlers, store, seed), config, lib (uuid, validation), types, UI
```

Feature-Sliced Design: inner layers cannot import from outer layers. `@/` resolves to `src/`.

## API (MSW Mocked)

All requests intercepted by MSW in the browser. No backend server required.

| Method | Path                          | Description            |
| ------ | ----------------------------- | ---------------------- |
| POST   | `/api/v1/auctions/list`       | Paginated auction list |
| GET    | `/api/v1/auctions/:uuid`      | Auction detail         |
| GET    | `/api/v1/auctions/:uuid/bets` | Bet history            |
| POST   | `/api/v1/auctions/:uuid/bets` | Place a bet            |

75 seed auctions with generated data.

## Before Commit

Husky + lint-staged runs automatically on `git commit`. Always run `npm run finish`
before committing — project must be in a working state with no blocking errors.

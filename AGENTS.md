# AGENTS.md

## What To Read First

1. `README.md` — project purpose, how to run and validate
2. `ARCHITECTURE.md` — module structure, data flow, invariants

## How To Work In This Repo

- All React components end with `*.component.tsx`
- Project uses Feature-Sliced Design: `app/` → `routes/` → `pages/` → `entities/` → `shared/`
- Import direction: inner layers cannot import from outer layers
- `@/` alias resolves to `src/`

## Validation Commands

```
npm run dev        # start dev server
npm test           # unit tests (vitest, 103 tests)
npm run test:e2e   # e2e tests (playwright)
npm run build      # production build
npm run finish     # full static check: lint → typecheck → test → format → knip → build
npm run lint       # ESLint (type-aware, 0 errors required)
npm run coverage   # test coverage report (text + html)
```

## Pre-Commit

Husky + lint-staged auto-runs on `git commit`:

- `eslint --fix` + `prettier --write` on `.ts`/`.tsx`
- `prettier --write` on `.json`/`.md`/`.css`

## Before Commit

- Always run `npm run finish` and ensure 0 errors before committing
- Project must be in a working state at all times: no blocking errors, no broken builds
- If `finish` fails, fix issues before commit — never commit known-broken code

## Update Rules

- After architectural decisions: update `ARCHITECTURE.md`

## Boundaries

- No backend — API is mocked via MSW in `src/shared/api/msw/`
- Zustand for UI state only (no server data)
- TanStack Query for all API data
- Zod for validation boundaries (forms + URL params)
- ESLint errors block commit: `complexity ≤ 12`, `max-params ≤ 3`, `max-lines ≤ 250`, no floating promises, eqeqeq
- Knip must report 0 issues (`npm run knip`)
- Before using any library API, verify against official docs for the installed version — never assume signatures or import paths

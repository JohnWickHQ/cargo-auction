# AI-Ready TS Project Baseline

## Operator Summary

Use this section first.

If the LLM follows only one part of this document, it should follow this one.

### What This Guide Is For

This guide helps an LLM:

- bootstrap a new `TypeScript + React + Vite + Node.js` project;
- or strengthen a young existing project with a similar stack.

It covers two layers:

1. the minimum AI operating infrastructure the project should expose on a cold
   start;
2. the engineering baseline that keeps the codebase healthy and maintainable.

### What The LLM Should Do First

For an existing project:

1. perform a short environment sanity check;
2. inspect the current repo;
3. summarize what already exists;
4. compare it against this guide;
5. propose a phased plan;
6. discuss the plan with the user;
7. implement only the agreed phase.

For a new project:

1. create the minimum AI operating infrastructure;
2. set up the core validation loop;
3. leave behind a minimal runnable slice;
4. add strict typing, linting, formatting, and tests;
5. reconcile the bootstrap checklist;
6. pause before product implementation unless the transition is explicitly
   confirmed;
7. add optional hygiene/reporting layers later.

Before claiming the guide is complete in either mode:

1. re-audit the repo against the mandatory baseline;
2. name what is complete, what is deferred, and what is still missing;
3. only then claim completion.

### Minimum AI Operating Infrastructure

The project should usually expose:

- a minimal cold-start operating layer;
- a recommended extended operating layer.

Mandatory cold-start layer:

- `README.md`
- `AGENTS.md`
- `ARCHITECTURE.md`

Recommended extended layer:

- `PLANS.md`
- `exec-plans/active/`
- `exec-plans/completed/`
- `current-state.md`
- `roadmap.md`
- `decision-log.md`
- `working-agreements.md`
- `open-questions.md`
- `logs/interaction-log/`

For `logs/interaction-log/`, prefer:

- an index file;
- periodic log files;
- active maintenance after substantial work;
- semantic summaries instead of raw dumps.

### Minimum Engineering Baseline

The project should usually expose at least:

- deterministic scripts:
  - `lint`
  - `typecheck`
  - `test`
  - `build`
  - `check`
- strict TypeScript baseline;
- type-aware ESLint baseline;
- Prettier;
- a minimal runnable slice;
- tests;
- build validation;
- optional-but-recommended coverage reporting.

### Minimal Runnable Slice

For a greenfield project, the bootstrap should leave behind a small but real
working slice of the app.

This usually means:

- the app starts in dev mode;
- the app builds successfully;
- the root route or entry view renders;
- there is at least one smoke-level test or equivalent validation;
- the project is visibly alive, not only configured.

This does not imply full product implementation.

The goal is:

- baseline + runnable skeleton first;
- feature delivery later, as a separate agreed phase.

### Recommended Later

Add after the core loop is stable:

- `Knip`
- coverage thresholds
- complexity or structural-health reports
- stricter CI gates

### Main Guardrails

The LLM should:

- work in phases;
- avoid broad repo-wide setup churn;
- not silently introduce optional layers while fixing mandatory ones;
- keep bootstrap/setup work separate from product feature implementation;
- preserve working equivalents where they already exist;
- re-check the repo after each phase;
- summarize what changed before moving to the next phase;
- not claim the guide is complete without a final checklist reconciliation.

## Purpose

This guide helps an LLM set up or strengthen a
`TypeScript + React + Vite + Node.js` project in two modes:

- greenfield bootstrap;
- adoption planning for a young existing project.

The goal is a practical baseline for healthy, production-ready, AI-friendly
codebases:

- minimum AI operating infrastructure so the LLM can orient itself on a cold
  start;
- deterministic validation commands;
- reliable type safety;
- lint rules that catch correctness and maintainability issues;
- automated formatting;
- behavior-oriented tests;
- useful dead-code and dependency hygiene checks;
- and a clear path for gradually tightening the project as it grows.

## Scope

This guide fits small and medium projects with a similar stack:

- `TypeScript`
- `React`
- `Vite`
- `Node.js`

It is most useful for product apps, internal tools, and frontend-heavy repos
with some Node-side tooling.

It is not a universal template for monorepos, backend-only services, published
libraries, or ecosystems with materially different build/runtime assumptions.

Use it as a baseline reference, not as a claim that every repo should become
structurally identical.

If the repo already has a working equivalent for a recommended tool or file,
the LLM should prefer preserving that working shape over replacing it for
cosmetic conformity.

## Operating Principle

An LLM should not blindly install everything in this guide.

Use it as:

- an ordered baseline reference;
- an audit checklist;
- and a phased adoption guide.

For an existing project, the LLM should audit first, propose a staged plan,
and implement only the agreed phase.

For a new project, the LLM can use the same guide more directly as a bootstrap
target, but should still follow the execution order below rather than setting
up everything in one uncontrolled pass.

## LLM Execution Protocol

This guide should be executed in order, not mined selectively.

The LLM should work in explicit phases and avoid broad setup churn.

### Mandatory Order

1. inspect the current project state;
2. summarize what already exists;
3. compare the project against this guide;
4. group gaps into:
   - mandatory now
   - recommended soon
   - optional later
5. propose a phased plan;
6. discuss and confirm the plan with the user;
7. implement only the agreed phase;
8. run the relevant checks;
9. summarize what changed and what remains.

### Execution Guardrails

The LLM should:

- work one phase at a time;
- not silently introduce optional layers while fixing mandatory ones;
- treat setup/baseline work and product implementation as separate phases even
  if the user mentions both in one request;
- re-check the repo after each phase;
- run formatter or `format:check` before phase closeout when the phase touched
  docs, config, scripts, or many files across the repo;
- explicitly name what remains missing after each phase;
- stop and discuss tradeoffs when a change causes broad churn or migration
  cost.

### Phase Reconciliation Format

At the end of each phase, the LLM should summarize in this shape:

- what is now true;
- what files or configs changed;
- what checks ran and what passed or failed;
- what is still missing from the mandatory baseline;
- what is intentionally deferred to a later phase.

### Greenfield Default Order

For a new project, the default order should be:

1. minimum AI operating infrastructure;
2. deterministic scripts;
3. TypeScript baseline;
4. ESLint baseline;
5. Prettier;
6. minimal runnable slice;
7. tests;
8. coverage reporting;
9. bootstrap checklist reconciliation;
10. explicit transition to product work if requested;
11. codebase hygiene checks;
12. optional structural-health checks;
13. CI gate.

### Existing-Project Default Order

For a young existing project, the default order should be:

1. run a short environment sanity check;
2. audit current state;
3. normalize the AI operating infrastructure if missing;
4. normalize the core validation loop;
5. strengthen TypeScript and ESLint carefully;
6. stabilize tests;
7. add coverage reporting;
8. add `Knip`;
9. add optional later controls only if the user wants them.

### Short Working Checklist

Before implementation:

- verify that the local package manager and toolchain are sane enough for the
  adoption pass;
- read the project's current operating docs;
- inspect scripts and configs;
- identify what already matches this guide;
- write down the proposed phase and scope.

During implementation:

- change only the agreed layer;
- keep the rest of the repo stable;
- verify as you go.

After implementation:

- run the relevant checks;
- summarize new baseline status;
- list what is still missing or deferred;
- name the next recommended phase, but do not auto-expand into it.

### Completion Gate

Before claiming that the guide has been fully applied, the LLM should re-audit
the repo against this checklist and explicitly report each area as:

- complete;
- deferred by agreement;
- or still missing.

Mandatory completion checklist:

- mandatory cold-start operating docs exist:
  - `README.md`
  - `AGENTS.md`
  - `ARCHITECTURE.md`
- `.gitignore` covers generated and dependency output;
- required scripts exist:
  - `lint`
  - `typecheck`
  - `test`
  - `build`
  - `check`
- TypeScript baseline is configured;
- ESLint baseline is configured;
- Prettier or an equivalent formatter policy exists;
- test runner exists and runs;
- coverage reporting exists when it was part of the agreed phase, or when the
  project is already past the minimal bootstrap stage;
- README documents the main commands;
- relevant checks were run successfully for the implemented phase.

The LLM should not treat a green `check` command alone as proof that the whole
guide has been applied.

## Baseline Philosophy

The intended engineering stance:

- deterministic commands are mandatory;
- type safety is default, not optional;
- formatting should be automated;
- lint should focus on correctness and maintainability;
- tests should prove behavior, not only produce numbers;
- build output is never source of truth;
- stronger controls should be added in layers;
- if testing is painful, inspect code shape before adding more scaffolding.

## Baseline Areas

This guide covers:

- AI operating infrastructure;
- deterministic scripts;
- TypeScript strictness;
- ESLint correctness rules;
- Prettier formatting;
- testing;
- coverage reporting;
- codebase hygiene checks;
- optional structural-health checks;
- CI gates.

These areas are not equally urgent. Follow the phased order rather than
treating them as one flat checklist.

## Current-State Audit For Existing Projects

Before proposing changes to an existing project, inspect at least the
following.

### Scripts

Check whether the project already has:

- `lint`
- `typecheck`
- `test`
- `build`
- `check`
- `coverage`
- `format`
- `format:check`

### AI Operating Infrastructure

Check whether the project already has a minimal LLM-facing operating layer:

- `README.md`
- `AGENTS.md`
- `ARCHITECTURE.md`
- `PLANS.md`
- `exec-plans/active/`
- `exec-plans/completed/`
- `current-state.md`
- `roadmap.md`
- `decision-log.md`
- `working-agreements.md`
- `open-questions.md`
- `logs/interaction-log/`

Also check whether these are real operating documents, whether startup reading
order is clear, and whether logs use an index plus periodic files instead of
one endlessly growing document.

Also check whether `current-state` is still acting as a compact re-entry
snapshot rather than drifting into:

- history log;
- project dossier;
- backlog;
- or roadmap substitute.

### TypeScript

Check:

- whether `TypeScript` is already installed;
- whether `strict` mode is enabled;
- whether the project uses a single `tsconfig` or split configs;
- whether `noUncheckedIndexedAccess` is enabled;
- whether `exactOptionalPropertyTypes` is enabled;
- whether there is a dedicated build config vs validation config;
- whether app/client and node/tooling code are separated cleanly.

### ESLint

Check:

- whether ESLint exists at all;
- whether it is type-aware;
- whether it already uses flat config or legacy config;
- whether it includes correctness-critical rules such as:
  - `no-floating-promises`
  - `no-misused-promises`
  - exhaustiveness checks
- whether it is overloaded with stylistic rules that Prettier should own.

### Formatting

Check:

- whether `Prettier` is installed;
- whether there is a formatter command;
- whether ESLint and formatting responsibilities are mixed unnecessarily.

### Tests

Check:

- whether a test runner exists;
- whether the test command actually runs in CI-ready form;
- whether tests are unit-only or also cover real behavior seams;
- whether React UI tests use a suitable setup such as Testing Library.

### Coverage

Check:

- whether a coverage command exists;
- whether it generates a report;
- whether thresholds exist;
- whether exclusions are intentional or just random drift.

### Codebase Hygiene

Check:

- whether `Knip` exists;
- whether dead-code/dependency hygiene is already tracked another way;
- whether the project has obvious unused files, exports, or dependencies.

### CI

Check:

- whether the project runs any validation in CI;
- whether CI includes `lint`, `typecheck`, `test`, and `build`;
- whether the repo depends only on local machine discipline.

## Adoption Policy For Young Existing Projects

When strengthening an existing young project:

- preserve what is already working;
- do not replace equivalent tooling without reason;
- allow local operating-layer adaptation when the project already has a clear
  home such as `project-ops/`;
- fix the core validation loop before adding more observability;
- prefer staged adoption over one huge churn pass;
- do not weaken rules globally just to silence real design or typing issues;
- do not introduce blocking gates that the current codebase cannot realistically
  satisfy yet.

Use the upgrade path below as the default adoption order.

## Minimum AI Operating Infrastructure

For AI-first work, the project should expose a small set of documents that make
the repo legible on a cold start. This layer should stay compact and
operational.

### Constitutional Documents

These should usually exist in almost every project:

- `README.md`
- `AGENTS.md`
- `ARCHITECTURE.md`

Recommended roles:

- `README.md`
  - what the project is;
  - how to run it;
  - how to validate it;
  - where the main entrypoints are.
- `AGENTS.md`
  - how an LLM should work in this repo;
  - what to read first;
  - what files to update;
  - what boundaries or rules to follow.
- `ARCHITECTURE.md`
  - major modules and boundaries;
  - data flow or request flow;
  - important invariants;
  - places where accidental drift is risky.

### Planning And Execution Layer

Recommended default:

- `PLANS.md`
- `exec-plans/active/`
- `exec-plans/completed/`

### Operational Memory Layer

Recommended default:

- `current-state.md`
- `roadmap.md`
- `decision-log.md`
- `working-agreements.md`
- `open-questions.md`

Recommended roles:

- `current-state.md`
  - compact snapshot of current operational truth;
  - no history dump;
  - no long rationale archive;
  - no broad backlog.
- `roadmap.md`
  - future direction and ordered likely work;
  - not active execution detail.
- `decision-log.md`
  - durable decisions and their rationale;
  - not every temporary choice.
- `working-agreements.md`
  - repo-specific collaboration rules and stable operating norms.
- `open-questions.md`
  - unresolved issues worth keeping visible;
  - not backlog and not archived history.

### Interaction Log Layer

Recommended default:

- `logs/interaction-log/`

Recommended shape:

- one index file at the log root, such as `logs/interaction-log.md` or
  `logs/interaction-log/README.md`;
- periodic log files, such as weekly or monthly files;
- append meaningful summaries after substantial work;
- avoid a single endlessly growing document.

Recommended policy:

- maintain it actively;
- keep entries semantic, not raw dumps;
- use the index to explain the logging pattern;
- do not treat the log as live control state.
- if a project already has a well-understood local ops layer such as
  `project-ops/`, prefer adapting this structure there instead of copying the
  guide literally into root.

## How The AI Operating Documents Work Together

The AI operating layer should not be treated as a flat pile of helpful files.
It should work as a small system with clear boundaries.

The main risk to avoid is duplication:

- repeating current truth in too many files;
- turning logs into a second roadmap;
- turning roadmap files into task trackers;
- or letting planning artifacts compete with architecture and state files.

### Startup Reading Order

On a cold start, the LLM should usually read in this order:

1. `README.md`
2. `AGENTS.md`
3. `ARCHITECTURE.md`
4. `current-state.md`
5. `working-agreements.md`
6. `open-questions.md`
7. `decision-log.md` when the task touches durable choices
8. `roadmap.md` when the task touches future direction
9. `PLANS.md` when the work is substantial
10. active files in `exec-plans/active/` when the task belongs to an active
    execution track
11. `logs/interaction-log/` only for recent context or historical trace

This order matters:

- `README` explains what the project is;
- `AGENTS` explains how to behave in the repo;
- `ARCHITECTURE` explains the system shape;
- `current-state` explains what is true right now;
- only after that should the model step into planning, open questions, or
  historical trace.

### Source-Of-Truth Boundaries

Each document should own a different kind of truth:

- `README.md`
  - project purpose;
  - setup and run commands;
  - main entrypoints.
- `AGENTS.md`
  - repo-specific LLM workflow rules;
  - startup reading order;
  - update expectations.
- `ARCHITECTURE.md`
  - stable system structure;
  - module boundaries;
  - invariants.
- `current-state.md`
  - compact current operational truth;
  - the current stop point;
  - the current active focus.
- `working-agreements.md`
  - stable collaboration rules;
  - conventions that should shape future work.
- `open-questions.md`
  - unresolved questions still worth active attention.
- `decision-log.md`
  - decisions that are already made and durable enough to preserve.
- `roadmap.md`
  - plausible future direction and ordered later work;
  - not active task detail.
- `PLANS.md`
  - the contract for how substantial work should be planned and tracked.
- `exec-plans/active/`
  - live substantial execution tracks.
- `exec-plans/completed/`
  - preserved completed execution traces.
- `logs/interaction-log/`
  - semantic history of meaningful work;
  - not live control state.

### Non-Duplication Rules

Recommended rules:

- keep `current-state.md` short and current;
- do not turn `current-state.md` into a history log;
- do not turn `roadmap.md` into active task execution;
- do not turn `decision-log.md` into a diary;
- do not turn `open-questions.md` into a backlog;
- do not turn `interaction-log` into a second source of live truth;
- do not let `exec-plans` compete with `ARCHITECTURE.md` or `README.md` for
  stable system explanation.

### Planning And Execution Flow

The recommended workflow is:

1. use `roadmap.md` for future direction;
2. when a substantial item becomes active, move execution into an
   `exec-plans/active/` artifact governed by `PLANS.md`;
3. use the active ExecPlan as the canonical work carrier during execution;
4. when the work is complete, move it to `exec-plans/completed/`;
5. update `current-state.md`, `decision-log.md`, `open-questions.md`, or
   `roadmap.md` only where the finished work changes current truth.

Separation of roles:

- `roadmap` says what may happen later;
- `ExecPlan` says what is happening now;
- `current-state` says what is true now;
- `interaction-log` says what happened.

### Update Rules By Change Type

Use the following default update logic.

If the work changes current operational truth:

- update `current-state.md`

If the work establishes or changes a durable rule or decision:

- update `decision-log.md`
- possibly update `working-agreements.md`

If the work creates or resolves an unresolved question:

- update `open-questions.md`

If the work changes future direction but is not yet active:

- update `roadmap.md`

If the work is substantial and active:

- create or update an active ExecPlan

If the work is meaningful and should remain discoverable later:

- append a semantic entry to `logs/interaction-log/`

### Lifecycle Rules

Recommended lifecycle:

- current and active material stays in:
  - `current-state.md`
  - `open-questions.md`
  - `roadmap.md`
  - `exec-plans/active/`
- completed substantial work moves to:
  - `exec-plans/completed/`
- historical trace stays in:
  - `logs/interaction-log/`
- stable explanation remains in:
  - `README.md`
  - `AGENTS.md`
  - `ARCHITECTURE.md`

Each file type should stay narrow and not absorb every other role.

## Recommended Project Layout

This guide does not require one rigid folder structure, but the project should
separate concerns clearly enough that humans and LLMs can navigate it without
guessing.

Recommended default shape:

- `src/`
  - application code
- `tests/`
  - repo-level tests or mirrored test structure
- `scripts/` or `tooling/`
  - Node-side automation, migration scripts, or project tooling
- `public/`
  - static assets if the app uses them
- `dist/`
  - generated build output only
- project operating docs at repo root or in one clearly named project-ops layer

Inside `src/`, prefer one clear organizational strategy such as:

- by feature;
- by route/screen;
- by domain slice.

Recommended separation rules:

- keep React app code separate from Node/tooling code;
- keep generated files out of hand-edited source folders;
- keep tests close to the code they validate or in a mirrored test tree;
- keep shared utilities narrow and named clearly;
- avoid a giant `utils/` dump if a more specific home exists.

## Generated Files, Environment, And Dependency Policy

### Generated Files

Recommended policy:

- `dist/`, coverage output, and generated reports are not source of truth;
- generated outputs should usually be ignored by git unless there is a release
  reason to commit them;
- edit source inputs, not generated output files.

### Environment Sanity

Before an adoption pass, quickly verify:

- the package manager resolves and runs;
- install or update commands are not obviously blocked by a broken local store;
- the main validation tools resolve from the repo as expected;
- the local machine state is not already in a visibly broken configuration.

If these checks fail, treat the issue as environment friction first, not as
proof that the baseline design is wrong.

### Environment And Secrets

Recommended policy:

- commit a `.env.example` when env vars are part of normal setup;
- document required variables in `README.md`;
- never hardcode secrets or commit real secret values;
- prefer explicit env names over hidden magic defaults.

### Dependencies

Recommended policy:

- add a dependency only when it removes meaningful effort or risk;
- prefer `devDependencies` for build, test, lint, formatting, and tooling;
- use runtime `dependencies` only for packages the shipped app or server needs;
- avoid adding a package for a tiny helper if native platform APIs are
  sufficient;
- prefer repo-local dependencies for project-owned tooling over undocumented
  global requirements.
- remove accidental setup residue that does not have a clear operational role.

## Minimal Core Baseline

This is the baseline that should usually exist in every project of this stack.

### Required Scripts

Required:

- `lint`
- `typecheck`
- `test`
- `build`
- `check`

Recommended:

- `coverage`
- `format`
- `format:check`

Suggested command shape:

```json
{
  "scripts": {
    "lint": "eslint src tests",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "coverage": "vitest run --coverage",
    "build": "vite build",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "check": "npm run lint && npm run typecheck && npm run test && npm run build"
  }
}
```

The exact folder targets may differ, but the command contract should stay
deterministic.

### Node And Package Manager Baseline

Recommended:

- declare `engines` in `package.json`;
- prefer repo-local dependencies for project-owned tooling;
- avoid depending on global machine state for normal validation.

Example:

```json
{
  "engines": {
    "node": ">=20.18.0",
    "npm": ">=10.0.0"
  }
}
```

## Recommended TypeScript Baseline

Use a split config model when the project has both app code and Node-side
tooling/scripts.

Suggested shape:

- `tsconfig.base.json`
- app/client `tsconfig.json`
- Node/tooling `tsconfig.node.json`

### Recommended `tsconfig.base.json` Options

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "sourceMap": true
  }
}
```

### Recommended Interpretation

These options should be treated as the target baseline:

- `strict`
- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- `noFallthroughCasesInSwitch`
- `isolatedModules`

These are also valuable, but may create more cleanup work in a loose repo:

- `noUnusedLocals`
- `noUnusedParameters`

If the existing project is still immature and enabling all flags at once causes
too much churn, adopt them in phases. Do not silently disable the stronger
flags forever just because they surfaced real ambiguity.

### Suggested Validation And Build Separation

Example validation config:

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src", "tests", "vite.config.ts", "vitest.config.ts"]
}
```

Example Node/tooling config:

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": ".",
    "outDir": "dist",
    "noEmit": false,
    "types": ["node"]
  },
  "include": ["scripts/**/*.ts", "tooling/**/*.ts"]
}
```

The exact split may vary, but the goal is:

- validation config for project-wide type safety;
- build config for actual output;
- avoid one overloaded `tsconfig` trying to serve every concern at once.

## Recommended ESLint Baseline

Prefer type-aware ESLint for TypeScript projects.

### Rule Focus

ESLint should mainly enforce:

- correctness
- maintainability
- risky async behavior
- basic clarity

It should not become a giant style engine when Prettier already owns
formatting.

### Recommended Baseline Rules

Required or strongly recommended:

- `@typescript-eslint/no-floating-promises: error`
- `@typescript-eslint/no-misused-promises: error`
- `@typescript-eslint/switch-exhaustiveness-check: error`
- `eqeqeq: ["error", "always"]`
- `no-fallthrough: error`

Recommended:

- `@typescript-eslint/consistent-type-imports`
- `@typescript-eslint/no-unused-vars` with `_` ignore pattern
- `prefer-const`

Suggested shape:

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx", "tests/**/*.ts", "tests/**/*.tsx"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      eqeqeq: ["error", "always"],
      "no-fallthrough": "error",
      "prefer-const": "warn",
    },
  }
);
```

### Test-Specific Relaxations

Tests can be looser where that improves readability.

Reasonable targeted relaxations may include:

- allowing limited `any` in tests;
- allowing narrower fixture shortcuts;
- avoiding production-grade abstraction pressure in test scaffolding.

But keep those relaxations narrow. Test code should not become a dumping ground
for discipline debt.

## Prettier Policy

Formatting should be automated.

Recommended stance:

- keep Prettier config minimal;
- let Prettier own formatting;
- keep stylistic ESLint rules light;
- use formatter checks in CI only if they improve consistency without too much
  friction.

Suggested minimal config:

```json
{
  "singleQuote": false,
  "trailingComma": "es5"
}
```

This is a reference baseline, not a mandate for these exact style choices.

## Testing Baseline

Use `Vitest` by default unless the project has a strong reason not to.

Recommended baseline:

- `Vitest` as the default test runner;
- `React Testing Library` for UI behavior;
- one smoke test minimum on bootstrap;
- tests should read like behavior proof, not like setup theater.

Suggested policy:

- unit and integration tests first;
- avoid coverage inflation through trivial wrapper tests only;
- add tests especially for:
  - bugfixes
  - behavior changes
  - parsing logic
  - state transitions
  - contracts between modules

When tests feel too hard to write, inspect whether the code mixes too many
responsibilities before adding more mocks.

## Coverage Policy

Coverage reporting should exist early, but hard thresholds should not be the
first lever.

Recommended:

- have a `coverage` command from early on;
- generate text and HTML reports;
- use exclusions intentionally;
- treat coverage as a control surface, not as the main goal.

Suggested `Vitest` shape:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
```

Thresholds can be added later when:

- the baseline is stable;
- the team trusts the signal;
- the project is no longer changing shape every day.

## Codebase Hygiene Checks

Codebase hygiene checks are useful, but they are not the same thing as the
core validation loop.

### Knip

`Knip` is recommended as the main graph-level hygiene tool for this stack.

It is useful for:

- unused files;
- unused exports;
- unused exported types;
- unused dependencies;
- unlisted dependencies or binaries;
- unresolved imports.

`Knip` is not a replacement for ESLint.

The difference:

- ESLint finds intra-file issues such as unused variables or unsafe async usage;
- Knip finds inter-file and package-graph residue.

Suggested commands:

```json
{
  "scripts": {
    "knip": "knip",
    "knip:exports": "knip --exports",
    "knip:dependencies": "knip --dependencies"
  }
}
```

Recommended adoption:

1. add it as a report;
2. inspect false positives and project file patterns;
3. clean easy issues;
4. only later consider making it part of CI.

Do not make `Knip` a hard gate on day one unless the project is already stable
enough to support that discipline.

## Optional Structural-Health Checks

These are useful later, but not part of the minimum baseline:

- complexity reports;
- dependency cycle checks;
- duplication checks;
- bundle-size reports;
- import-boundary checks.

They should usually start as non-blocking reports.

Use them when the project begins to show real symptoms:

- feature changes become risky;
- modules grow without clear responsibility;
- dead files accumulate;
- dependency sprawl starts to slow the team down.

## CI Gate

Minimum recommended CI gate:

- `lint`
- `typecheck`
- `test`
- `build`

Recommended later additions:

- `coverage`
- `knip`
- structural-health reports

The key principle:

- block CI on the core reliability loop first;
- add hygiene and structural gates only after the repo can sustain them.

## Validation By Change Type

The same validation depth is not appropriate for every change.

Recommended default mapping:

- UI/component change
  - `lint`
  - `typecheck`
  - relevant tests
  - `build`
  - optionally browser/manual verification when the change is user-visible
- shared type or API contract change
  - `lint`
  - `typecheck`
  - all directly affected tests
  - `build`
- tooling/config change
  - validate the changed tool path directly
  - run `lint`, `typecheck`, `test`, or `build` depending on the changed layer
- bugfix
  - reproduce or name the failing behavior
  - add or run the closest regression test
  - verify the fix directly
- structural refactor
  - keep behavior validation explicit
  - avoid claiming success from green formatting-only checks

This does not need to become a giant classifier. The point is to stop the LLM
from treating every change as if one generic validation loop were always
enough.

## Optional UI End-To-End Layer

For UI-heavy projects, an end-to-end layer may become useful after the unit and
integration baseline is stable.

Recommended stance:

- do not require browser E2E on day one;
- consider Playwright or an equivalent tool once UI behavior becomes complex
  enough that unit/integration tests alone stop giving enough confidence;
- keep E2E as a later confidence layer, not as a replacement for the core test
  baseline.

## Greenfield Setup Path

For a new project, the LLM should usually:

1. initialize the project;
2. create the minimum AI operating infrastructure;
3. install core dependencies;
4. install baseline dev tooling;
5. create `tsconfig`, ESLint, Prettier, and Vitest config;
6. define deterministic scripts;
7. create a small initial folder structure;
8. create a minimal runnable app shell or entry route;
9. verify that the app starts and builds;
10. add one smoke test;
11. run `lint`, `typecheck`, `test`, and `build`;
12. fix the setup until they all pass;
13. reconcile the greenfield bootstrap checklist;
14. leave a short README section with the commands;
15. pause and confirm the transition before starting product-specific
    implementation unless that next phase was explicitly agreed.

### Greenfield Bootstrap Checklist

For a new project, the LLM should explicitly verify that the repo now has:

- `README.md`
- `AGENTS.md`
- `ARCHITECTURE.md`
- `PLANS.md`
- `exec-plans/active/`
- `exec-plans/completed/`
- `current-state.md`
- `roadmap.md`
- `decision-log.md`
- `working-agreements.md`
- `open-questions.md`
- `logs/interaction-log/` with index + periodic file pattern
- `.gitignore`
- `package.json` scripts for:
  - `lint`
  - `typecheck`
  - `test`
  - `build`
  - `check`
- TypeScript config
- ESLint config
- Prettier config or equivalent formatter policy
- a minimal runnable app shell or entry route
- test runner config
- coverage command, if coverage reporting is part of the agreed bootstrap
  target
- at least one working test

If any mandatory item is missing, the LLM should report that directly instead
of implying the bootstrap is finished.

## Young Existing Project Upgrade Path

For a young existing project, the LLM should:

1. run a short environment sanity check;
2. inspect the existing setup;
3. summarize what already exists;
4. compare the repo against this baseline;
5. separate gaps into:
   - must add now
   - should add soon
   - optional later
6. discuss adoption tradeoffs with the user;
7. implement the agreed changes in stages.

Recommended staging:

### Phase 0. Environment Sanity

Confirm:

- package-manager state is usable;
- install and script execution paths are not already broken;
- version mismatches or blocked build approvals are understood before baseline
  conclusions are drawn.

### Phase 1. AI Operating Infrastructure

Add or normalize:

- `README.md`
- `AGENTS.md`
- `ARCHITECTURE.md`
- planning and operational-memory documents
- `logs/interaction-log/` with index + periodic files

### Phase 2. Core Validation Loop

Add or normalize:

- `lint`
- `typecheck`
- `test`
- `build`
- `check`

### Phase 3. Type And Lint Discipline

Strengthen:

- TypeScript strictness;
- type-aware ESLint;
- core async/correctness rules.

### Phase 4. Test And Coverage Baseline

Add:

- stable Vitest setup;
- at least minimal behavior tests;
- coverage reporting.

### Phase 5. Graph Hygiene

Add:

- `Knip`
- first dead-code/dependency cleanup pass

### Phase 6. Optional Health Controls

Add later only if justified:

- thresholds;
- complexity gates;
- CI blocking hygiene checks;
- structural reports

## LLM Output Contract

After using this guide in a real project, the LLM should leave behind a clear
result, not just changed files.

Recommended output shape:

- current-state audit summary;
- environment sanity summary when adoption touched package-manager or toolchain
  state;
- proposed or executed phase;
- changes made;
- checks run and results;
- AI operating docs updated;
- what is still missing vs mandatory baseline;
- what is intentionally deferred;
- remaining recommended next phase.

For existing-project adoption, it is also acceptable for the output to say:

- the core baseline is now healthy enough to stop here;
- optional layers were reviewed and deliberately deferred;
- no further rollout is needed in this pass.

This helps the repo keep a stable working rhythm across sessions.

## Decision Matrix

Use the following default interpretation when discussing adoption.

| Item                                                                                                  | Level            | Why                                                                  | Default advice                  |
| ----------------------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------- | ------------------------------- |
| `lint`                                                                                                | mandatory        | catches correctness and maintainability issues early                 | add immediately                 |
| `typecheck`                                                                                           | mandatory        | enforces type safety and API consistency                             | add immediately                 |
| `test`                                                                                                | mandatory        | proves behavior and regressions                                      | add immediately                 |
| `build`                                                                                               | mandatory        | proves the project can ship                                          | add immediately                 |
| `check`                                                                                               | mandatory        | one deterministic entrypoint for the core loop                       | add immediately                 |
| `README.md` / `AGENTS.md` / `ARCHITECTURE.md`                                                         | mandatory        | gives the LLM and collaborators a cold-start operating surface       | add immediately                 |
| `PLANS.md` + `exec-plans/`                                                                            | recommended      | makes substantial work trackable and reviewable                      | add early                       |
| `current-state.md` / `roadmap.md` / `decision-log.md` / `working-agreements.md` / `open-questions.md` | recommended      | creates an operational memory layer without forcing full bureaucracy | add early                       |
| `logs/interaction-log/` with index + periodic files                                                   | recommended      | preserves semantic work trace across sessions                        | add early and maintain actively |
| `Prettier`                                                                                            | mandatory        | removes style churn from review                                      | add immediately                 |
| strict TypeScript                                                                                     | mandatory target | prevents ambiguity and fragile contracts                             | adopt early; phase if needed    |
| type-aware ESLint                                                                                     | mandatory target | catches async and logic mistakes                                     | adopt early                     |
| coverage report                                                                                       | recommended      | improves visibility without forcing bad thresholds                   | add after tests are stable      |
| `Knip` report                                                                                         | recommended      | finds graph-level dead code and dependency residue                   | add after the core loop         |
| hard coverage thresholds                                                                              | optional later   | useful only when the signal is trusted                               | defer                           |
| `Knip` CI blocker                                                                                     | optional later   | can be noisy before the repo stabilizes                              | defer                           |
| complexity gate                                                                                       | optional later   | useful, but easy to overuse too early                                | defer                           |

## LLM Discussion Protocol

When using this guide inside another project, the LLM should:

1. audit the current project baseline first;
2. say what already exists and what is missing;
3. avoid replacing equivalent tooling without reason;
4. propose a staged adoption plan;
5. separate:
   - mandatory now
   - recommended soon
   - optional later
6. discuss tradeoffs before broad churn;
7. implement only the agreed baseline changes.

The LLM should not interpret this guide as a license to install every
recommended tool in one pass.

## Done Definitions

### Greenfield Done

Baseline setup is done when:

- the minimum AI operating infrastructure exists;
- required scripts exist;
- the repo contains a minimal runnable slice;
- the app starts in dev mode or an equivalent local run path is verified;
- `lint`, `typecheck`, `test`, and `build` pass;
- TypeScript baseline is strong enough to be a real control surface;
- ESLint is configured and useful;
- Prettier is configured;
- Vitest is configured;
- at least one working test exists;
- README documents the project commands.

### Young Existing Project Upgrade Done

An upgrade pass is done when:

- the agreed baseline changes are landed;
- the repo is legible to an LLM on a cold start;
- the core validation loop is deterministic;
- the project no longer depends on ad hoc manual validation;
- `current-state` is still compact enough to work as a re-entry carrier;
- the next optional controls are visible, but not silently smuggled in;
- optional layers that were not adopted are explicitly deferred rather than
  half-installed;
- no accidental setup residue was left behind without a clear role;
- the repo is stronger without unnecessary broad churn.

## Non-Goals

This guide does not require:

- a monorepo architecture;
- a heavy or overdesigned control layer in every project;
- high coverage thresholds from day one;
- immediate `Knip` CI blocking;
- complexity gates from the first pass;
- heavy architecture tooling before the codebase earns it.

The aim is a strong, durable baseline for codebase health, not a maximalist
tooling stack.

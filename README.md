# Type with Bob

A friendly, beginner-focused touch-typing tutor that runs entirely in the browser. No accounts and no server: progress is saved in your browser.

## Requirements

- Node 22 (see `.nvmrc`; `nvm use` picks it up)

## Getting started

```sh
npm install
npx playwright install chromium   # once, for end-to-end tests
npm run dev                       # http://localhost:5173
```

## Commands

| Command                 | Purpose                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| `npm run dev`           | Dev server                                                               |
| `npm run build`         | Production build (static files in `build/client`)                        |
| `npm run preview`       | Serve the production build on http://localhost:4173                      |
| `npm run typecheck`     | Generate route types and type-check                                      |
| `npm run lint`          | ESLint, zero warnings allowed                                            |
| `npm run format`        | Format with Prettier (`format:check` to verify only)                     |
| `npm test`              | Unit and component tests (Vitest)                                        |
| `npm run test:watch`    | Vitest in watch mode                                                     |
| `npm run test:coverage` | Tests with coverage thresholds enforced                                  |
| `npm run test:e2e`      | Playwright end-to-end tests against the production build                 |
| `npm run check`         | typecheck + lint + format:check + tests with coverage + build (the gate) |

## Where things live

```
app/
  routes.ts        route config
  root.tsx         HTML shell, root error boundary
  routes/          thin route modules
  features/        self-contained features, each with a public index.ts
  components/ui/   generic reusable UI
  lib/             small shared utilities
e2e/               Playwright specs
```

The project rules are in `CLAUDE.md` and the current iteration's plan is in `PLAN.md`.

## Deploying

`npm run build` produces a static single-page app in `build/client`. Configure the host to serve `index.html` for every path.

# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React + TypeScript source (entry: `src/main.tsx`, root component: `src/App.tsx`).
- `src/assets/`: Static assets imported by components.
- `public/`: Public assets served as-is.
- `index.html`: Vite HTML template.
- `eslint.config.js`, `tsconfig*.json`, `vite.config.ts`: Tooling configs.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server with HMR.
- `npm run build`: Type-check (`tsc -b`) and create production build.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint on the project.

Examples:
- Local dev: `npm ci && npm run dev`
- Production build: `npm run build && npm run preview`

## Coding Style & Naming Conventions
- Language: TypeScript + React 19 (functional components, Hooks).
- Linting: ESLint (`typescript-eslint`, `react-hooks`, `react-refresh`). Fix issues before committing.
- Indentation: 2 spaces; prefer single quotes; trailing commas where valid.
- Naming: `PascalCase` for React components/files (e.g., `UserCard.tsx`), `camelCase` for variables/functions, `UPPER_SNAKE_CASE` for constants.
- Imports: Use relative paths within `src/`; group and sort logically.

## Testing Guidelines
- No test framework is configured yet. Contributions adding tests are welcome.
- Preferred stack: Vitest + React Testing Library.
- File pattern: colocate as `Component.test.tsx` next to the component.
- Aim for meaningful unit tests around pure logic and critical UI states.

## Commit & Pull Request Guidelines
- Commits: Keep focused and descriptive. Conventional Commits are encouraged (e.g., `feat: add logistic growth chart`).
- PRs: Include a clear summary, screenshots/GIFs for UI changes, and link related issues.
- Checks: Run `npm run lint` and `npm run build` locally; ensure no type or lint errors.
- Scope: Prefer small, reviewable PRs; update docs when changing behavior.

## Security & Configuration Tips
- Env vars: Use `VITE_` prefix (access via `import.meta.env`). Avoid committing secrets.
- Types: Adjust strictness in `tsconfig.app.json` if needed.
- Assets: Place importable assets in `src/assets/`; public files in `public/`.

# Changelog

## Unreleased

### Fixed
- CI: two quick pushes to `main` could cancel an in-progress deployment, because the workflow-level `concurrency` cancelled the whole earlier run. Now only superseded PR runs are cancelled.

## 1.2.0 — 2026-11-04

### Added
- **Live site** on GitHub Pages: <https://boboidvtw.github.io/super-calculator/>. The `deploy` job in `ci.yml` runs only on `main` (or manual `workflow_dispatch`) after lint, tests with coverage and build pass (#2).
- **Branch protection** on `main`: the `verify` check must pass; force pushes and deletion are blocked; merged branches are deleted automatically. PRs can use `gh pr merge --auto --squash` (#4).
- **Documentation**: detailed README (features table, usage, keyboard shortcuts, `?lng=` links, CI/CD, FAQ), new [CONTRIBUTING.md](CONTRIBUTING.md) (workflow, commit types, adding a calculator or a language) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (layers, PWA caching, deployment, decision log).

### Changed
- Dev tooling: ESLint 9 → 10 (`@eslint/js` 10, `eslint-plugin-react-refresh` 0.5), `vite-plugin-pwa` 1 → 2; `overrides` pin `minimatch` ≥ 11.0.4 and `glob` ≥ 14.0.3. `npm audit`: 19 moderate + 2 low → 4 low (dev-only `deepmerge` via `workbox-build`, no upstream fix yet) (#3).

### Fixed
- Offline cache could be wiped by the root site's service worker on the same origin (`boboidvtw.github.io`); fixed on the root site in v3.11.3 ([boboidvtw/boboidvtw.github.io#1](https://github.com/boboidvtw/boboidvtw.github.io/pull/1)).

## 1.1.0 — 2026-11-04

### Fixed
- **Build**: `npm run build` failed with 6 TypeScript errors (type-only imports, unused variables); lint errors cleared.
- **Currency**: "last updated" always showed *Invalid Date*; now uses the provider's update timestamp. Moved from the deprecated v4 endpoint to the keyless `open.er-api.com/v6` endpoint, and a corrupted `localStorage` cache no longer crashes the page.
- **Insurance IRR**: results were clamped at −45.96 %/yr (a hard −5 %/month search floor) and long policies could overflow; the solver now brackets −99.9 %…+100 %/month and reports when no IRR exists.
- **Standard calculator**: division by zero showed `0` instead of an error; `0.1 + 0.2` showed `0.30000000000000004`; history entries were duplicated under React StrictMode.
- **Anniversary**: dates were parsed as UTC, so the day count was off by one west of UTC (and before 08:00 in Taiwan); empty dates showed `NaN`; DST-safe day counting.
- **Number base**: `1G` in hex was silently read as `1`; values above 2^53 lost precision (now `BigInt`).
- **Health**: body-fat estimate is labelled as an estimate, hidden for under-18s and for empty age (was `NaN`).
- **Routing**: duplicate `/fuel` route; tip, discount and insurance were missing from the home screen; unknown routes now redirect home.

### Added
- Full translations for all 8 languages (de, fr, es, ja, ko, zh-CN were menu-only), enforced at compile time by a shared `Translation` type and a key-parity test. Browser tags like `en` / `zh-HK` now map to a supported language instead of falling back to Chinese.
- Physical keyboard input on every keypad; on-screen input length limits.
- PWA icons (the manifest referenced files that did not exist), maskable icon, offline caching of exchange rates.
- GitHub Actions CI: lint, tests with ≥80 % coverage gate, build.
- `LICENSE` (MIT), this changelog.

### Changed
- Calculation logic moved out of components into tested pure modules (`src/utils/calculator.ts`, `finance.ts`, `health.ts`, `dateUtils.ts`, `numericInput.ts`); shared `useNumericInput` hook and `<NumPad>` component replace per-page copies.
- Calculator pages are lazy-loaded; one feature registry (`src/features.ts`) drives routes, home grid and menu.
- Accessibility: labelled icon buttons, `aria-pressed`/`aria-expanded` states, visible focus ring, `<html lang>` follows the UI language.
- Dependencies updated within their ranges; `react-router-dom` 7.18.5 resolves 2 high-severity advisories.

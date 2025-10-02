# AGENTS

## Project overview
- Vite + React + TypeScript app with Tailwind CSS and Radix UI primitives. Source is under `src/` with domain logic in `components/`, `hooks/`, `lib/`, `pages/`, `routes/`, and shared types in `types.ts`. `@` is aliased to `src` in both Vite and Vitest configs—prefer that import style for stability. 【F:package.json†L1-L56】【F:vitest.config.ts†L1-L40】
- The schedule workflow drives most domain logic: hooks in `src/hooks/`, API helpers in `src/lib/api.ts`, and domain types in `src/types.ts`. Review those before touching schedule features to avoid breaking constraints (leader duplication, quotas, fixed/off day rules). 【F:src/App.tsx†L1-L120】【F:src/lib/api.ts†L1-L120】【F:src/types.ts†L1-L120】
- Tests live in the top-level `test/` directory (Vitest + React Testing Library) with additional colocated specs inside `src/components/**/__tests__`. Always add or update tests alongside logic changes. 【F:test/AppProviders.test.tsx†L1-L22】【F:package.json†L6-L18】

## Local commands
- `npm install` – install dependencies (Node ≥20.15.1).
- `npm run dev` – launch Vite dev server (proxies API calls to port 5001).
- `npm run test` / `npm run test:unit` – run Vitest via the wrapper in `scripts/run-vitest.mjs` (threads capped by `VITEST_MAX_THREADS`).
- `npm run typecheck`, `npm run lint`, and `npm run build` – keep CI parity locally. 【F:package.json†L6-L54】【F:scripts/run-vitest.mjs†L1-L40】

## Frontend architecture
- **Layout & routing**: `src/App.tsx` mounts the glass sidebar shell and lazy-loads the large pages (`Dashboard`, `Schedule`, `Chatbot*`). Shared layout primitives are in `src/components/layout/` and `src/components/app-sidebar.tsx`. Keep skip-links and focus management intact. 【F:src/App.tsx†L1-L160】【F:src/components/app-sidebar.tsx†L1-L160】
- **UI system**: Glassmorphism primitives (`GlassCard`, `GlassButton`, `GlassBadge`, etc.) live in `src/components/ui/glass.tsx`. Always reach for these wrappers instead of raw shadcn components to keep styling consistent. The Tailwind tokens that back them are declared in `src/index.css` under the glass utility layer. 【F:src/components/ui/glass.tsx†L1-L160】【F:src/index.css†L1-L120】
- **Domain widgets**: Schedule matrix, fixed/off panels, toolbar, and legend are under `src/components/Schedule/` and `src/components/Toolbar.tsx`. Dashboard cards and charts are under `src/components/section-cards.tsx` and `chart-area-interactive.tsx`. Respect their prop contracts when extending features. 【F:src/components/Schedule/MatrixTable.tsx†L1-L80】【F:src/components/Toolbar.tsx†L1-L120】

## Styling & UX rules
- Keep the glass visual language: backgrounds at 85–95% opacity, `backdrop-blur-3xl`, gradients for primary CTAs, and the `shadow-glass` / `shadow-ios` shadows defined in the design system. Reference existing variants in `glass.tsx` instead of adding bespoke Tailwind classes. 【F:src/components/ui/glass.tsx†L1-L160】
- Sidebar and schedule toolbar already match design specs; when modifying them, preserve the macOS traffic lights, gradient icon badges, and spacing scale (`gap-2/4/6`). 【F:src/components/app-sidebar.tsx†L1-L160】【F:src/components/Toolbar.tsx†L1-L120】
- Maintain accessible focus handling (`focus-visible:ring-2 ring-sky-400`) and minimum touch targets (`h-11` on action buttons). Ensure every interactive Radix primitive has an `aria-label` or visible text. 【F:src/components/ui/glass.tsx†L41-L120】【F:src/components/ui/sidebar.tsx†L1-L120】

## Data & API conventions
- API helpers in `src/lib/api.ts` throw on non-2xx responses after normalizing messages. Reuse them so toast handlers receive meaningful errors and to avoid duplicating fetch logic. Never swallow thrown errors—surface them via toast + logging. 【F:src/lib/api.ts†L1-L160】
- Types for API payloads and schedule entities live in `src/types.ts`. Extend those instead of sprinkling `any`. Introduce DTO-specific types when shaping new payloads. 【F:src/types.ts†L1-L160】
- Hooks in `src/hooks/useScheduleData.ts` orchestrate fetching staff, fixed/off assignments, validations, and matrix summaries. Touching schedule behavior requires updating related tests under `test/` (matrix, toolbar, conflict list). 【F:src/hooks/useScheduleData.ts†L1-L160】【F:test/matrixRow.snapshot.test.tsx†L1-L40】

## Testing expectations
- Follow the existing Vitest + React Testing Library patterns. If you change schedule logic, cover both happy-path and edge cases (leader duplication, quota violations, validation conflicts) under `test/`. Add MSW handlers when mocking network responses. 【F:test/useScheduleData.test.tsx†L1-L160】【F:test/quickEditDialog.test.tsx†L1-L160】
- UI regressions are guarded by snapshot suites (`test/__snapshots__/`). Update snapshots deliberately and justify changes in PR descriptions.
- For accessibility-sensitive changes, run the `test/matrixTable.a11y.test.tsx` suite and extend it with new axe assertions if needed. 【F:test/matrixTable.a11y.test.tsx†L1-L120】

## Miscellaneous
- Fonts, animations, and theme tokens are configured in `src/globals.css` and `src/index.css`. Align new utility classes with these tokens; avoid inline hard-coded colors.
- When introducing new shared components, export them through `src/components/index.ts` to keep barrel imports coherent. 【F:src/components/index.ts†L1-L160】
- Keep documentation synchronized: major architecture adjustments should be reflected in `ARCHITECTURE.md` at the repo root (create/update if necessary).

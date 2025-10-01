# AGENTS

## Context
- Vite + React + TypeScript with Tailwind, shadcn/ui, and Radix primitives; core code sits in `src/components`, `src/hooks`, `src/utils`, and `src/types`.
- Schedule module now ships an Apple-inspired glassmorphism experience; review `src/components/Schedule` and `src/components/ui/glass.tsx` for patterns.
- Matrix grid, FixedOffPanel, and CSV export button continue to live in the toolbar; see [ARCHITECTURE](../docs/ARCHITECTURE.md) for module wiring.
- Keep `any` out of the codebase and introduce DTO types for every API payload.

## Commands
- `npm i`
- `npm run dev` – proxies API to :5001
- `npm run test`
- `npm run typecheck`
- `npm run build`

## Glass Design System
- Reuse `GlassCard`, `GlassButton`, `GlassBadge`, `GlassPanel`, `GlassContainer`, and `GlassInput` from `src/components/ui/glass.tsx` instead of ad-hoc glass styling.
- Default translucency: backgrounds 90–95% opacity with `backdrop-blur-2xl` and `backdrop-saturate-150`; borders use `border-white/30` (dark mode `border-white/20`).
- Buttons: six variants (`default`, `primary`, `secondary`, `outline`, `ghost`, `destructive`) with `rounded-xl`, 300 ms transitions, and hover/active scale when `interactive`.
- Badges: six variants (`default`, `primary`, `success`, `warning`, `destructive`, `info`) with soft shadows; rank chips stay solid and high-contrast.
- Panels/containers: keep blur consistent per layer (`sm`–`2xl`) and apply the shared shadow recipe `0 8px 32px` rgba.

## Schedule Module UX
- Sticky glass header uses multi-layer stacking (`top-0`, `top-52px`, `top-84px`) with decreasing opacity; preserve `z-40` ordering and shadow specs.
- Matrix table scrolls smoothly, removes harsh borders (`border-white/10` max), and applies custom subtle scrollbars; main card caps width at 1600 px.
- Matrix rows alternate glass stripes (40 % / 60 % opacity), drop right borders, and only keep subtle bottom borders; hover states bump opacity + shadow.
- Toolbar and dialogs adopt glass components; glass buttons default to `h-11` for touch targets.

## UI Rules
- Badge variants for leader/night/PGD; duplicate leaders gain the `duplicate` badge with red border and tooltip context.
- Fixed/Off panel: all fields required, prevent empty `Select` values, wire `aria-describedby`, and surface validation via glass panels.
- Weekend cells tint `bg-amber-50/40`; totals columns use stronger glass (`bg-white/50` with backdrop blur).
- Keep spacing on the 8 px grid (padding `px-4/6`, gaps `gap-3/4/6`, margins in 8 px multiples) and enforce typography hierarchy (extra-bold totals, bold headers, semibold labels, medium secondary text).

## Accessibility
- Resolve Radix warnings (Descriptions, `aria-*`); every `Select.Item` and command surface must provide non-empty values.
- Provide `aria-describedby` for glass forms and ensure tooltip triggers remain focusable; respect focus-visible rings defined in the glass buttons.

## Testing
- RTL tests for `FixedOffPanel` (open dialog, create, delete) using `msw` to mock the API.
- Snapshot test for matrix row rendering with leader and duplicate indicators to guard the glass badge states.

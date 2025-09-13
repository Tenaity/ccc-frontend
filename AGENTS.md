# AGENTS

## Context
Vite + React + TypeScript with Tailwind, shadcn/ui, and Radix primitives. Key folders: `src/components`, `src/hooks`, `src/utils`, `src/types`. Matrix grid, FixedOffPanel, and CSV export button live in the toolbar. See [ARCHITECTURE](../docs/ARCHITECTURE.md).

## Commands
- `npm i`
- `npm run dev` – proxies API to :5001
- `npm run test`
- `npm run typecheck`
- `npm run build`

## UI rules
- Badge variants for leader/night/PGD; highlight duplicate leaders with red border
- Fixed/Off panel: required fields, prevent empty `Select` values, provide `aria-describedby`
- Disallow `any`; add types for API DTOs

## Testing
- RTL tests for `FixedOffPanel` (open dialog, create, delete; use `msw` for API)
- Snapshot test for matrix row rendering with leader and duplicate indicators

## Accessibility
Fix Radix warnings (Description/aria); ensure `Select.Item` values are not empty

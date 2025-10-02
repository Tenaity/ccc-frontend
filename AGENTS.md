# AGENTS

## Context
- Vite + React + TypeScript with Tailwind, shadcn/ui, and Radix primitives; core code sits in `src/components`, `src/hooks`, `src/utils`, and `src/types`.
- All UI now uses Apple-inspired glassmorphism design system; review `src/components/ui/glass.tsx` for the Glass UI components.
- Schedule module, Dashboard, ChatbotCRUD, and Sidebar all follow Glass UI patterns.
- Matrix grid, FixedOffPanel, and CSV export button continue to live in the toolbar; see [ARCHITECTURE](../docs/ARCHITECTURE.md) for module wiring.
- Keep `any` out of the codebase and introduce DTO types for every API payload.

## Commands
- `npm i`
- `npm run dev` – proxies API to :5001
- `npm run test`
- `npm run typecheck`
- `npm run build`

## Glass Design System
- **Core Components**: Reuse `GlassCard`, `GlassButton`, `GlassBadge`, `GlassPanel`, `GlassContainer`, and `GlassInput` from `src/components/ui/glass.tsx` instead of ad-hoc glass styling or standard shadcn components.
- **Translucency Standards**:
  - Backgrounds: 85–95% opacity with `backdrop-blur-3xl` and `backdrop-saturate-150`
  - Borders: `border-slate-200/60` (light mode), `border-slate-800/60` (dark mode)
  - Shadows: `shadow-glass` for light mode, `shadow-glass-lg` for dark mode, `shadow-ios` for interactive elements
  - Focus rings: `ring-sky-400` with `ring-2` for keyboard navigation
- **Buttons**: Six variants (`default`, `primary`, `secondary`, `outline`, `ghost`, `destructive`)
  - Rounded corners: `rounded-lg` for small buttons, `rounded-xl` for standard buttons
  - Blue-pink gradient for primary: `bg-gradient-to-br from-sky-500 via-indigo-500 to-pink-500`
  - Enhanced shadows: `shadow-[0_10px_40px_rgba(56,189,248,0.4),0_4px_20px_rgba(236,72,153,0.3)]` for primary
  - Destructive gradient: `from-rose-500 via-pink-500 to-red-500`
  - Transitions: 200ms duration with `ease-ios` timing
  - Interactive scale: `active:scale-95` when `interactive={true}`
  - Size variants: `sm` (h-8, px-3), `md` (h-10, px-4), `lg` (h-11, px-6), `icon` (h-10, w-10)
- **Badges**: Six variants (`default`, `primary`, `success`, `warning`, `destructive`, `info`)
  - Rounded: `rounded-full` with `px-3 py-1.5`
  - Primary uses gradient: `from-sky-500/15 via-indigo-500/15 to-pink-500/15` with `border-sky-400/40`
  - Success/warning/destructive use semantic colors (emerald/amber/rose) with 15-25% opacity backgrounds
  - Text colors: Bold semibold font for primary, regular for others
- **Panels/Cards**: Three strength variants (`default`, `subtle`, `strong`)
  - Default: `bg-white/85 dark:bg-slate-900/85`, Strong: `bg-white/95 dark:bg-slate-900/95`, Subtle: `bg-white/70 dark:bg-slate-900/70`
  - All use `rounded-lg` or `rounded-xl` depending on size
  - Consistent padding: `p-6` for major sections, `p-5` for compact areas
  - Gap hierarchy: `gap-6` (24px) for major sections, `gap-4` (16px) for grouped items, `gap-2` (8px) for tight spacing
- **Color Palette**:
  - Primary accent: Sky (500-600) to Indigo (500-600) to Pink (500-600) gradients
  - Active states: Sky-100 to Indigo-100 gradient backgrounds
  - Borders: Slate-200/60 light, Slate-800/60 dark
  - Text: Foreground for primary, muted-foreground for secondary

## Sidebar Design (app-sidebar.tsx)
- Background: `bg-white/95 dark:bg-slate-950/95` with `backdrop-blur-3xl backdrop-saturate-150`
- Borders: `border-slate-200/60 dark:border-slate-800/60`
- Nav items:
  - Rounded: `rounded-xl` for main items, `rounded-lg` for sub-items
  - Active state: `bg-white/90` with `shadow-ios` and `ring-1 ring-sky-400/40`
  - Icon containers: Gradient backgrounds when active (`from-sky-100 to-indigo-100`)
  - Hover: `hover:bg-white/80` with smooth transitions
  - Collapsible borders: `border-slate-200/50 dark:border-slate-800/50` for sub-menu separators
- macOS traffic lights: Keep the red/yellow/green dots in header
- Brand logo: Blue-pink gradient circle with icon

## Dashboard Design
- **Section Cards** (section-cards.tsx):
  - Use `GlassCard` variant="strong" with `p-6` padding
  - Layout: Grid with responsive columns (1 col mobile → 2 col tablet → 4 col desktop)
  - Typography: Bold h3 for numbers, medium text for labels, small muted for descriptions
  - Badges: Use semantic variants (success for positive trends, destructive for negative)
  - Dividers: `border-slate-200/60 dark:border-slate-800/60` to separate sections
  - Icons: Color-coded (emerald-500 for positive, rose-500 for negative)
- **Chart Component** (chart-area-interactive.tsx):
  - Use `GlassCard` variant="strong" with `p-6` padding
  - Header: Text hierarchy with h3 title, sm description
  - Time range selector: ToggleGroup for desktop, Select for mobile
  - Chart maintains existing gradient fills and responsive height

## ChatbotCRUD Design
- Container: `GlassPanel` variant="strong" with `flex flex-col gap-6 p-6`
- Toolbar:
  - Search input: Full-width responsive with icon, `h-11` height
  - Buttons: `GlassButton` with `size="lg"` for better touch targets
  - Column selector: Dropdown with outline button
  - Add button: Primary variant with gradient
- Stats badges: Use `GlassBadge` with info/primary variants
- Table:
  - Container: `rounded-xl` with slate borders and `shadow-ios`
  - Header: Sticky with `bg-white/95 backdrop-blur-2xl` and enhanced z-index
  - Rows: Hover states with `hover:bg-slate-50/50`
  - Sort indicators: Sky-500 colored chevrons
  - Action buttons: Outline for edit, destructive for delete
- Pagination:
  - Badge for current page indicator
  - Glass buttons for navigation with disabled states

## Schedule Module UX
- Sticky glass header uses multi-layer stacking (`top-0`, `top-52px`, `top-84px`) with decreasing opacity; preserve `z-40` ordering and shadow specs.
- Matrix table scrolls smoothly, removes harsh borders (`border-white/10` max), and applies custom subtle scrollbars; main card caps width at 1600 px.
- Matrix rows alternate glass stripes (40 % / 60 % opacity), drop right borders, and only keep subtle bottom borders; hover states bump opacity + shadow.
- Toolbar and dialogs adopt glass components; glass buttons default to `h-11` for touch targets.
- Year/Month selectors and action buttons (Generate, Shuffle, Validate, Save, Reset) all use `GlassButton` with appropriate variants.
- Two-panel layout: GlassPanel for controls, GlassPanel for actions with consistent gap-6 spacing.

## UI Rules
- **Always use Glass UI components** instead of base shadcn components:
  - `GlassButton` instead of `Button`
  - `GlassCard` or `GlassPanel` instead of `Card`
  - `GlassBadge` instead of `Badge`
- Badge variants for leader/night/PGD; duplicate leaders gain the `duplicate` badge with red border and tooltip context.
- Fixed/Off panel: all fields required, prevent empty `Select` values, wire `aria-describedby`, and surface validation via glass panels.
- Weekend cells tint `bg-amber-50/40`; totals columns use stronger glass (`bg-white/50` with backdrop blur).
- Keep spacing on the 8 px grid (padding `px-4/6`, gaps `gap-3/4/6`, margins in 8 px multiples).
- Typography hierarchy: extra-bold for totals/numbers, bold for headers, semibold for labels, medium for secondary text, regular for body.
- Border radius consistency: `rounded-lg` for small components, `rounded-xl` for panels and cards.

## Accessibility
- Resolve Radix warnings (Descriptions, `aria-*`); every `Select.Item` and command surface must provide non-empty values.
- Provide `aria-describedby` for glass forms and ensure tooltip triggers remain focusable.
- Respect focus-visible rings: `ring-2 ring-sky-400` for keyboard navigation.
- Interactive elements must meet 44px minimum touch target (use `h-11` for buttons).

## Testing
- RTL tests for `FixedOffPanel` (open dialog, create, delete) using `msw` to mock the API.
- Snapshot test for matrix row rendering with leader and duplicate indicators to guard the glass badge states.
- Test Glass UI component variants and states (hover, active, disabled).

## Migration Notes
- **Completed migrations**:
  - ✅ Sidebar (app-sidebar.tsx): Updated to Glass UI with enhanced borders, shadows, and gradient accents
  - ✅ ChatbotCRUD page: Replaced Card with GlassPanel, all buttons with GlassButton, badges with GlassBadge
  - ✅ Dashboard (section-cards.tsx, chart-area-interactive.tsx): Migrated to GlassCard with semantic badge variants
  - ✅ Schedule module (ScheduleMatrixRoute.tsx): Already using Glass UI components
- **Component replacement patterns**:
  - `<Card>` → `<GlassCard variant="strong">` or `<GlassPanel variant="strong">`
  - `<Button variant="default">` → `<GlassButton variant="default">`
  - `<Button variant="destructive">` → `<GlassButton variant="destructive">`
  - `<Badge>` → `<GlassBadge variant="[semantic]">`
- When updating components, maintain existing functionality while applying Glass UI styling patterns.

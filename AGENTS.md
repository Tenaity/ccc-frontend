# AGENTS

## Project overview
- Vite + React + TypeScript app with Tailwind CSS and Radix UI primitives. Source is under `src/` with domain logic in `components/`, `hooks/`, `lib/`, `pages/`, `routes/`, and shared types in `types.ts`. `@` is aliased to `src` in both Vite and Vitest configs—prefer that import style for stability.
- The schedule workflow drives most domain logic: hooks in `src/hooks/`, API helpers in `src/lib/api.ts`, and domain types in `src/types.ts`. Review those before touching schedule features to avoid breaking constraints (leader duplication, quotas, fixed/off day rules).
- Tests live in the top-level `test/` directory (Vitest + React Testing Library) with additional colocated specs inside `src/components/**/__tests__`. Always add or update tests alongside logic changes.
- **Multi-department support**: Phase 1 & 2 added department management (`/departments`) and custom shift configuration (`/shift-config`) with Apple-inspired premium UI.

## Local commands
- `npm install` – install dependencies (Node ≥20.15.1).
- `npm run dev` – launch Vite dev server (proxies API calls to port 5001).
- `npm run test` / `npm run test:unit` – run Vitest via the wrapper in `scripts/run-vitest.mjs` (threads capped by `VITEST_MAX_THREADS`).
- `npm run typecheck`, `npm run lint`, and `npm run build` – keep CI parity locally. 【F:package.json†L6-L54】【F:scripts/run-vitest.mjs†L1-L40】

## Frontend architecture
- **Layout & routing**: `src/App.tsx` mounts the Apple-inspired sidebar shell (`AppleSidebar.tsx`) and lazy-loads pages (`Dashboard`, `Schedule`, `Chatbot*`, `DepartmentManagement`, `ShiftConfig`). Routes defined in `src/app/routes.tsx`. Keep skip-links and focus management intact.
- **UI system**: Glassmorphism primitives (`GlassCard`, `GlassButton`, `GlassBadge`, `GlassPanel`) live in `src/components/ui/glass.tsx`. Always use these instead of raw components for consistent styling. Tailwind tokens in `src/index.css` under glass utility layer.
- **Domain widgets**: Schedule matrix, fixed/off panels, toolbar, and legend are under `src/components/Schedule/`. Dashboard cards under `src/components/section-cards.tsx`. **New**: Department & shift management pages under `src/pages/DepartmentManagement.tsx` and `src/pages/ShiftConfig.tsx`.

## Phase 1 & 2: Multi-Department Support (COMPLETED)

### New Pages

#### 1. DepartmentManagement (`src/pages/DepartmentManagement.tsx`)
**Route**: `/departments`

**Features**:
- **Stats Cards** (3 cards):
  - Total Departments - sky-indigo gradient
  - Total Staff - emerald-teal gradient
  - Custom Shifts - violet-purple gradient
- **Department Cards Grid**:
  - Display: name, code, icon (colored circle), description
  - Stats: staff_count, shift_count
  - Hover effects reveal Edit/Delete buttons
  - Delete validation prevents deletion if staff exists
- **Create/Edit Dialog**:
  - Name & Code inputs
  - Icon Picker: 8 options (Building2, Users, Headphones, Briefcase, Monitor, Heart, ShoppingCart, Truck)
  - Color Picker: 8 colors (#3b82f6, #10b981, #8b5cf6, #f59e0b, #ec4899, #06b6d4, #f97316, #14b8a6)
  - Description textarea (optional)
  - Form validation & error handling

**APIs Used**:
```typescript
GET /api/departments
POST /api/departments
PUT /api/departments/:id
DELETE /api/departments/:id
```

**Components**:
- `PageHeader` - Gradient title with description
- `GlassPanel` - Container with glass-morphism
- `Button`, `Input`, `Label`, `Textarea`, `Dialog`

#### 2. ShiftConfig (`src/pages/ShiftConfig.tsx`)
**Route**: `/shift-config`

**Features**:
- **Stats Cards** (3 cards):
  - Total Shifts for selected department
  - Active Department (name + color indicator)
  - Total Departments count
- **Department Selector**:
  - Dropdown to switch between departments
  - Shows department color dot + name + code
- **Shift Cards Grid**:
  - Display: name, code (color-coded badge), start/end times, icon
  - Hover effects reveal Edit/Delete buttons
  - Empty state when no shifts configured
- **Create/Edit Dialog**:
  - Name & Code inputs
  - Start/End Time pickers (type="time")
  - Icon Picker: 8 shift-specific icons (Sun, Moon, Coffee, Clock, Calendar, Star, Briefcase, Headphones)
  - Color Picker: 10 pastel colors (#60a5fa, #34d399, #a78bfa, #fbbf24, #f472b6, #22d3ee, #fb923c, #2dd4bf, #c084fc, #fb7185)
  - Display order (auto-incremented)

**APIs Used**:
```typescript
GET /api/shift-configs?department_id=:id
POST /api/shift-configs
PUT /api/shift-configs/:id
DELETE /api/shift-configs/:id
```

### New Components

#### `PageHeader.tsx` (`src/components/ui/page-header.tsx`)
```typescript
interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}
```
- Gradient title (sky-600 to indigo-600)
- Muted description text
- Reusable across all pages

#### `Textarea.tsx` (`src/components/ui/textarea.tsx`)
```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>
```
- Standard textarea with consistent styling
- Border, focus ring, disabled states
- Integrates with Form components

### Routing Updates

**`src/app/routes.tsx`**:
```typescript
{
  path: "/schedule",
  label: "Schedule",
  children: [
    { path: "/schedule", label: "Matrix View", icon: TableIcon },
    { path: "/config", label: "Config", icon: Settings2 },
    { path: "/departments", label: "Departments", icon: Building2 }, // NEW
    { path: "/shift-config", label: "Shift Config", icon: Clock },  // NEW
  ]
}
```

**`src/App.tsx`**:
```typescript
const DepartmentManagementPage = lazy(() => import("./pages/DepartmentManagement"))
const ShiftConfigPage = lazy(() => import("./pages/ShiftConfig"))

// Routes
<Route path="/departments" element={<DepartmentManagementPage />} />
<Route path="/shift-config" element={<ShiftConfigPage />} />
```

### Design System Adherence

All new pages follow the established design system:

**Colors**:
- Primary gradient: `from-sky-600 to-indigo-600`
- Stats card gradients: sky-indigo, emerald-teal, violet-purple
- Pastel shift colors for better UX

**Glass-morphism**:
- `GlassPanel` variant="strong" - `bg-white/95 backdrop-blur-3xl`
- Consistent border opacity and shadows
- Smooth 300ms transitions

**Typography**:
- Gradient text for titles: `bg-gradient-to-r bg-clip-text text-transparent`
- Font weights: semibold (600) for labels, bold (700) for stats
- Text hierarchy: 3xl titles, base descriptions, sm labels

**Interactions**:
- Hover scale effects: `group-hover:scale-110`
- Button shadows: `shadow-md hover:shadow-lg`
- Smooth transitions: `transition-all duration-300`
- Active states with proper focus rings

### Integration Points

**With Backend**:
- All endpoints return proper error messages
- Delete operations validate dependencies
- Auto-migration adds `department_id` to existing staff

**With Existing UI**:
- Matches AppleSidebar navigation pattern
- Uses same GlassPanel variants as Config page
- Color palette extends existing gradient system
- Icons from same Lucide React library

### Testing Checklist
- ✅ All pages compile without TypeScript errors
- ✅ All components properly imported (PageHeader, Textarea, GlassPanel)
- ✅ Backend APIs functional (tested with curl)
- ✅ Frontend fetches and displays data correctly
- ✅ Create/Edit/Delete operations work end-to-end
- ✅ Validation prevents invalid operations (delete with staff, duplicate codes)
- ✅ No console errors or warnings
- ⏸️ Unit tests pending (add when feature stabilizes)

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

## Schedule Generation Flow (Frontend)

### Configuration Page (`src/pages/Config.tsx`)
Before generating schedules, users must configure the month via the Config page:

#### Tab 1: Holidays
- **Auto-fetch**: System automatically imports Vietnamese holidays on first visit (cached in localStorage for 30 days)
- **Manual import**: "Import from Nager" button to force re-import
- **Manual entry**: Add individual holidays with date picker + name
- **Hook**: `useHolidayAutoFetch` handles auto-import with localStorage cache

#### Tab 2: Month Plan
1. **Select Year/Month**: Dropdowns to choose target month
2. **Weekend Policy**: Radio buttons for sat_sun, sun_only, none
3. **Extra Days**:
   - `extra_offdays`: Add dates that should be off (e.g., compensatory leave)
   - `extra_workdays`: Add dates that should be working (e.g., Saturday work)
4. **Working Days Override**: Manual input to override auto-calculated working days
5. **Shift Defaults**: Input fields for day, night, leader, pgd, hc shift counts
6. **Save Button**: Stores `MonthConfig` + `ShiftPlanDefaults` to backend
7. **Generate Button**: Triggers schedule generation (disabled until config saved)

### Generation Flow
```typescript
// User clicks "Generate Schedule"
generateSchedule({ year, month })
  ↓
// Frontend checks if config exists (useMonthConfig hook)
if (!monthConfigData) {
  show error: "Tháng chưa được cấu hình. Vui lòng lưu thiết lập trước."
  return
}
  ↓
// POST /api/schedule/generate
await generateSchedule({ year, month, save: false })
  ↓
// Backend validates config exists
if (!MonthConfig || !ShiftPlanDefaults) {
  return 400: "Missing configuration"
}
  ↓
// Backend runs scheduler phases 0-3
schedule_month(year, month, ...)
  ↓
// Frontend receives assignments
{
  ok: true,
  planned: [...assignments],
  perDayLeaders: {...},
  conflicts: [...]
}
  ↓
// Frontend refetches schedule data
await refetchScheduleData()
  ↓
// Schedule page displays generated assignments in matrix
```

### Key Hooks
- **`useMonthConfig`**: Fetches/saves month configuration (weekend policy, extra days, working days)
- **`useShiftDefaults`**: Fetches/saves shift defaults (day/night/leader/pgd counts)
- **`useHolidayAutoFetch`**: Auto-imports holidays with localStorage cache (30-day TTL)
- **`useScheduleData`**: Orchestrates all schedule data fetching (staff, assignments, fixed, off, validate)

### Validation
- **Pre-generate**: Frontend checks `monthConfigMissing` flag and blocks generate if true
- **Post-generate**: Backend validates one leader per day, no conflicts, fair distribution
- **Display**: Conflicts shown in UI with badges and tooltips

## Miscellaneous
- Fonts, animations, and theme tokens are configured in `src/globals.css` and `src/index.css`. Align new utility classes with these tokens; avoid inline hard-coded colors.
- When introducing new shared components, export them through `src/components/index.ts` to keep barrel imports coherent. 【F:src/components/index.ts†L1-L160】
- Keep documentation synchronized: major architecture adjustments should be reflected in `ARCHITECTURE.md` at the repo root (create/update if necessary).

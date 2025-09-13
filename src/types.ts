// src/types.ts

// ================== ENUM-LIKE CONSTANTS ==================
export const Shift = {
  CA1: "CA1",
  CA2: "CA2",
  K:   "K",
  HC:  "HC",
  D:   "Đ",   // night shift
  P:   "P",
} as const;
export type ShiftCode = typeof Shift[keyof typeof Shift];

// Vai trò (type-safe) — khớp backend
export const StaffRole = {
  TC:  "TC",
  GDV: "GDV",
  HC:  "HC",
} as const;
export type RoleCode = typeof StaffRole[keyof typeof StaffRole];

// Lưu ý: backend CÓ THỂ trả "D_WHITE" cho Đ trắng @ tổng đài.
// "K_WHITE" để dành cho phase K trắng (đang tắt).
export const Pos = {
  TD: "TD",
  PGD: "PGD",
} as const;
export type Position = typeof Pos[keyof typeof Pos] | null;

// ================== DOMAIN TYPES ==================
export interface Staff {
  id: number;
  full_name: string;
  role: RoleCode;     
  can_night: boolean;
  base_quota: number;
  notes?: string | null;
}

export interface Assignment {
  day: string;              // ISO "YYYY-MM-DD"
  shift_code: ShiftCode;    // dùng Shift.*
  staff_id: number;
  position?: Position;      // dùng Pos.* hoặc null
}

export interface FixedAssignment {
  id: number;
  staff_id: number;
  day: string;              // ISO "YYYY-MM-DD"
  shift_code: ShiftCode;
  position?: Position;
  note?: string | null;
}

export interface OffDay {
  id: number;
  staff_id: number;
  day: string;              // ISO "YYYY-MM-DD"
  reason?: string | null;
}

export interface PlannedResult {
  ok: boolean;
  planned?: Assignment[];
  error?: string;
  details?: any;
}

// ================== TOTALS / PER-DAY BUCKETS ==================
export interface DayPlaceSummary {
  TD:    { K: number; CA1: number; CA2: number, D: number }; 
  PGD:   { K: number; CA2: number, D: number };
}

export function makeEmptyDayPlaceSummary(): DayPlaceSummary {
  return {
    TD:    { K: 0, CA1: 0, CA2: 0, D: 0 }, 
    PGD:   { K: 0, CA2: 0, D: 0 },
  };
}

// ================== ESTIMATE TYPES ==================
export interface EstimateDaysBreakdown {
  total: number;
  weekdays: number;
  saturdays: number;
  sundays: number;
  holidays: number;
}

export type EstimateResponse = {
  ok: boolean;
  year: number;
  month: number;
  days_in_month: number;

  required_heads_by_day:   Record<"CA1" | "CA2" | "K" | "Đ" | "HC" | "P", number>;
  required_heads_total:    number;

  required_shifts_by_code: Record<"CA1" | "CA2" | "K" | "Đ" | "HC" | "P", number>;
  required_shifts_total:   number;

  required_credits_by_shift: Record<"CA1" | "CA2" | "K" | "Đ" | "HC" | "P", number>;
  required_credits_total:  number;

  supply_total:          number;
  supply_credits_total:  number;

  delta_total:   number;
  delta_credits: number;

  meta: {
    weekdays: number;
    saturdays: number;
    sundays: number;
    holidays: number;
    hc_count: number;
    staff_total: number;
  };

  notes: string;
};

// ================== EXPECTED (RULE) ==================
export type ExpectedTD   = { K: number; CA1: number; CA2: number, D: number }; 
export type ExpectedPGD  = { K: number; CA2: number, D: number };

export type ExpectedPerDay  = { expectedTD: ExpectedTD; expectedPGD: ExpectedPGD };
export type ExpectedByDay   = Record<number, ExpectedPerDay>;

// ================== HELPERS (TYPE-SAFE) ==================
export const DAY_SHIFTS: ReadonlyArray<ShiftCode> = [Shift.CA1, Shift.CA2, Shift.K, Shift.HC];
export const NIGHT_SHIFTS: ReadonlyArray<ShiftCode> = [Shift.D];

// Night markers – không cần truyền role vì engine đã đảm bảo leader là TC
export function isNightLeader(a: { shift_code: ShiftCode; position?: Position | null, role?: RoleCode | null }) {
  return a.shift_code === Shift.D && a.position === Pos.TD && a.role === StaffRole.TC;
}
export function isNightTD(a: { shift_code: ShiftCode; position?: Position | null }) {
  return a.shift_code === Shift.D && a.position === Pos.TD;
}
export function isNightPGD(a: { shift_code: ShiftCode; position?: Position | null }) {
  return a.shift_code === Shift.D && a.position === Pos.PGD;
}

export const isTD  = (p: Position | null) => p === Pos.TD;
export const isPGD = (p: Position | null) => p === Pos.PGD;
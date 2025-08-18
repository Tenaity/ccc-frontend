// src/types.ts
export type ShiftCode = "CA1" | "CA2" | "K" | "HC" | "Đ" | "P";
export type Position = "TD" | "PGD" | "K_WHITE" | "D_WHITE" | null;

export interface Staff {
  id: number;
  full_name: string;
  role: "TC" | "GDV" | "HC";
  can_night: boolean;
  base_quota: number;
  notes?: string | null;
}

export interface Assignment {
  day: string;           // ISO date
  shift_code: ShiftCode;
  staff_id: number;
  position?: Position;
}

export interface PlannedResult {
  ok: boolean;
  planned?: Assignment[];
  error?: string;
  details?: any;
}

/** Bảng tổng theo vị trí/ngày để TotalsRows & MatrixTable xài chung */
export interface DayPlaceSummary {
  TD: { K_leader: number; K: number; CA1: number; CA2: number };
  PGD: { K: number; CA2: number };
  NIGHT: { leader: number; TD_WHITE: number; PGD: number };
  /** K trắng (thứ 7) – tách riêng để hiển thị */
  K_WHITE: number;
}

/** Breakdown số ngày trong tháng (dùng cho EstimatePanel) */
export interface EstimateDaysBreakdown {
  total: number;       // = days_in_month
  weekdays: number;    // T2–T6
  saturdays: number;   // T7
  sundays: number;     // CN
  holidays: number;    // số ngày lễ (rơi vào bất kỳ thứ nào)
}

// === Estimate (nhu cầu vs nguồn cung, theo THÁNG) ===
export type EstimateResponse = {
  ok: boolean;
  year: number;
  month: number;

  // --- Nhu cầu ---
  days_in_month: number;   // 👈 số ngày trong tháng
  required_heads_by_day: Record<"CA1" | "CA2" | "K" | "Đ" | "HC" | "P", number>;
  required_heads_total: number;

  // Tổng slot (người-ca) theo mã
  required_shifts_by_code: Record<"CA1" | "CA2" | "K" | "Đ" | "HC" | "P", number>;
  required_shifts_total: number;

  // Công quy đổi (credits)
  required_credits_by_shift: Record<"CA1" | "CA2" | "K" | "Đ" | "HC" | "P", number>;
  required_credits_total: number;

  // --- Nguồn cung ---
  supply_total: number;          // tổng slot cung
  supply_credits_total: number;  // tổng công quy đổi cung

  // --- Delta ---
  delta_total: number;    // supply_total - required_shifts_total
  delta_credits: number;  // supply_credits_total - required_credits_total

  // --- Meta ---
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

// === Rule expected per-day (đúng cấu trúc app.py trả về) ===
export type ExpectedDayTD = { K_leader: number; CA1: number; CA2: number };
export type ExpectedDayPGD = { K: number; CA2: number };
export type ExpectedNight = { leader: number; TD_WHITE: number; PGD: number };

export type ExpectedPerDay = {
  TD: ExpectedDayTD;
  PGD: ExpectedDayPGD;
  K_WHITE: number;
  NIGHT: ExpectedNight;
};

// Map: dd -> ExpectedPerDay
export type ExpectedByDay = Record<number, ExpectedPerDay>;
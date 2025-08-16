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

// === Estimate (nhu cầu vs nguồn cung) ===
export type EstimateResponse = {
  ok: boolean;
  year: number;
  month: number;
  required_heads_by_day: Record<"CA1" | "CA2" | "K" | "Đ" | "HC", number>;
  required_heads_total: number;
  required_credits_by_shift: Record<"CA1" | "CA2" | "K" | "Đ" | "HC", number>;
  required_credits_total: number;
  supply_credits_total: number;
  delta_credits: number; // supply - required
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

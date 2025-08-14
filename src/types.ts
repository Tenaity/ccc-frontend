export type ShiftCode = "CA1" | "CA2" | "HC" | "K" | "Đ" | "P";
export type Position = "TD" | "PGD" | "K_WHITE" | null;

export interface Staff {
  id: number;
  full_name: string;
  role: "TC" | "GDV" | "HC";
  can_night: boolean;
  base_quota?: number;
  notes?: string | null;
}

export interface Assignment {
  day: string;            // YYYY-MM-DD
  shift_code: ShiftCode;
  staff_id: number;
  position?: Position;
}

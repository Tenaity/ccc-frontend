import type { ShiftCode } from "../types";

export const SHIFT_CREDIT: Record<ShiftCode, number> = { CA1:1, CA2:1, HC:1, K:1.25, Đ:1.5, P:0 };
export const DAY_SHIFTS: ShiftCode[] = ["CA1","K","CA2"];
export const NIGHT_SHIFTS: ShiftCode[] = ["Đ"];
export const DOW_LABEL = ["CN","T2","T3","T4","T5","T6","T7"];

export const pickBg = (code?: ShiftCode) => {
  switch (code) {
    case "CA1": return "#E6F0FF";
    case "CA2": return "#FFE8CC";
    case "K":   return "#E6FFEA";
    case "HC":  return "#EDEBFF";
    case "Đ":   return "#FFE6EA";
    case "P":   return "#EEEEEE";
    default:    return "#F8F8F8";
  }
};

export function isNightLeader(a: {shift_code:string; position?:string|null}) {
  return a.shift_code === "Đ" && a.position === "TD";
}
export function isNightWhite(a: {shift_code:string; position?:string|null}) {
  return a.shift_code === "Đ" && a.position === "D_WHITE";
}
export function isNightPGD(a: {shift_code:string; position?:string|null}) {
  return a.shift_code === "Đ" && a.position === "PGD";
}
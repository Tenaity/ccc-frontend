// src/utils/date.ts
export const DOW_LABEL = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function fmtYMD(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
export function getDow(y: number, m: number, d: number) {
  return new Date(y, m - 1, d).getDay();
}
export function isWeekend(dow: number) {
  return dow === 0 || dow === 6;
}

// utils/date-parse.ts
export function parseYMD(iso: string) {
  // iso dạng "YYYY-MM-DD"
  const [y, m, d] = iso.split("-").map(n => parseInt(n, 10));
  return { yy: y, mm: m, dd: d };
}
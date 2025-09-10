import type { Assignment, FixedAssignment, OffDay, Position, ShiftCode } from "../types";

export interface Cell {
  code: ShiftCode;
  position: Position | null;
}

/**
 * buildCellIndex merges assignments, fixed assignments and off days into a Map for fast lookup.
 * Priority: OffDay > FixedAssignment > Assignment.
 */
export function buildCellIndex(
  assignments: Assignment[],
  fixed: FixedAssignment[],
  off: OffDay[],
): Map<string, Cell> {
  const map = new Map<string, Cell>();

  // off days override everything with shift code 'P'
  for (const o of off) {
    map.set(`${o.staff_id}|${o.day}`, { code: "P", position: null });
  }

  // fixed assignments override generated assignments
  for (const f of fixed) {
    const key = `${f.staff_id}|${f.day}`;
    if (!map.has(key)) {
      map.set(key, { code: f.shift_code, position: f.position || null });
    }
  }

  // regular assignments fill remaining cells
  for (const a of assignments) {
    const key = `${a.staff_id}|${a.day}`;
    if (!map.has(key)) {
      map.set(key, { code: a.shift_code, position: a.position || null });
    }
  }

  return map;
}

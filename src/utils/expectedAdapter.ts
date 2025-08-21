// src/utils/expectedAdapter.ts
import type { ExpectedByDay } from "../types";

/**
 * Map dữ liệu expected từ backend (format cũ TD, PGD, NIGHT)
 * sang format mới frontend (expectedTD, expectedPGD).
 */
export function mapExpectedResponse(raw: any): ExpectedByDay {
  const mapped: ExpectedByDay = {};

  if (!raw) return mapped;

  for (const [dayStr, valAny] of Object.entries(raw)) {
    const day = Number(dayStr);
    const val = valAny as any; // ép kiểu để tránh TS phàn nàn

    mapped[day] = {
      expectedTD: {
        K:   val?.TD?.K    ?? 0,
        CA1: val?.TD?.CA1  ?? 0,
        CA2: val?.TD?.CA2  ?? 0,
        D:   val?.TD?.D    ?? 0, // ⚠️ chỉ số lượng Đ ca đêm TD, không phân biệt leader
      },
      expectedPGD: {
        K:   val?.PGD?.K   ?? 0,
        CA2: val?.PGD?.CA2 ?? 0,
        D:   val?.PGD?.D   ?? 0, // ⚠️ chỉ số lượng Đ ca đêm PGD
      },
    };
  }

  return mapped;
}
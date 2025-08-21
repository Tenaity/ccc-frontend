// src/hooks/useExpectedRules.ts
import { useEffect, useState } from "react";
import type { ExpectedByDay } from "../types";  // ✅ dùng type chuẩn từ types.ts

// fetch JSON an toàn
async function safeJSON<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(json?.error || res.statusText || "Request failed");
  return json as T;
}

/**
 * Hook đọc “chuẩn theo rule” cho từng ngày trong tháng.
 * Output: expected: ExpectedByDay = { [dd]: { dayTD, dayPGD, nightTD, nightPGD } }
 */
export function useExpectedRules(year: number, month: number) {
  const [expected, setExpected] = useState<ExpectedByDay>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        // Backend /api/rules/expected trả về { ok, perDayExpected }
        const res = await fetch(`/api/rules/expected?year=${year}&month=${month}`);
        const json = await safeJSON<{ ok: boolean; perDayExpected: ExpectedByDay }>(res);
        setExpected(json.perDayExpected || {});
      } catch (e: any) {
        setError(e?.message || "Failed to load expected rules");
        setExpected({});
      } finally {
        setLoading(false);
      }
    })();
  }, [year, month]);

  return { expected, loading, error };
}
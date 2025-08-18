// src/hooks/useExpectedRules.ts
import { useEffect, useState } from "react";

export type ExpectedPerDay = Record<number, {
  TD: { K_leader: number; CA1: number; CA2: number };
  PGD: { K: number; CA2: number };
  K_WHITE: number;
  NIGHT: { leader: number; TD_WHITE: number; PGD: number };
}>;

async function safeJSON<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(json?.error || res.statusText || "Request failed");
  return json as T;
}

export function useExpectedRules(year: number, month: number) {
  const [expected, setExpected] = useState<ExpectedPerDay>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/rules/expected?year=${year}&month=${month}`);
        const json = await safeJSON<{ ok: boolean; perDayExpected: ExpectedPerDay }>(res);
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
import { useCallback, useState } from 'react';

import type { Holiday } from '../types';
import { apiFetch, safeJSON } from '@/lib/fetch';

export function useHolidays(year: number, month: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (ctx?: { year: number; month: number }) => {
      const y = ctx?.year ?? year;
      const m = ctx?.month ?? month;
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch(`/api/holidays?year=${y}&month=${m}`);
        const json = await safeJSON<Holiday[]>(res);
        setHolidays(json);
      } catch (err: any) {
        setError(err?.message || 'load failed');
      } finally {
        setLoading(false);
      }
    },
    [month, year],
  );

  const createHoliday = useCallback(
    async (payload: Omit<Holiday, 'id'>) => {
      const res = await apiFetch('/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await safeJSON<{ ok: boolean; item: Holiday }>(res);
      setHolidays((prev) => [...prev, json.item]);
      await load({ year, month });
      return json.item;
    },
    [load, month, year],
  );

  const deleteHoliday = useCallback(
    async (id: number) => {
      await apiFetch(`/api/holidays/${id}`, { method: 'DELETE' });
      setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
      await load({ year, month });
    },
    [load, month, year],
  );

  return {
    holidays,
    loading,
    error,
    load,
    createHoliday,
    deleteHoliday,
  };
}


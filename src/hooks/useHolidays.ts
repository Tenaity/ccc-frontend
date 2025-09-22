import { useState } from 'react';

import type { Holiday } from '../types';

async function safeJSON<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) {
      throw new Error(json?.error || res.statusText || 'Request failed');
    }
    return json as T;
  } catch (error) {
    if (!res.ok) {
      throw new Error(text || res.statusText);
    }
    throw error;
  }
}

export function useHolidays(year: number, month: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (ctx?: { year: number; month: number }) => {
    const y = ctx?.year ?? year;
    const m = ctx?.month ?? month;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/holidays?year=${y}&month=${m}`);
      const json = await safeJSON<Holiday[]>(res);
      setHolidays(json);
    } catch (err: any) {
      setError(err?.message || 'load failed');
    } finally {
      setLoading(false);
    }
  };

  const createHoliday = async (payload: Omit<Holiday, 'id'>) => {
    const res = await fetch('/api/holidays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await safeJSON<{ ok: boolean; item: Holiday }>(res);
    setHolidays((prev) => [...prev, json.item]);
    await load({ year, month });
    return json.item;
  };

  const deleteHoliday = async (id: number) => {
    await fetch(`/api/holidays/${id}`, { method: 'DELETE' });
    setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
    await load({ year, month });
  };

  return {
    holidays,
    loading,
    error,
    load,
    createHoliday,
    deleteHoliday,
  };
}


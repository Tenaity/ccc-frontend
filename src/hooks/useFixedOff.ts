import { useCallback, useState } from 'react';
import type { FixedAssignment, OffDay } from '../types';

async function safeJSON<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data?.error || res.statusText || 'Request failed');
  return data as T;
}

export function useFixedOff(year: number, month: number) {
  const [fixed, setFixed] = useState<FixedAssignment[]>([]);
  const [off, setOff] = useState<OffDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (ctx?: { year: number; month: number }) => {
      const y = ctx?.year ?? year;
      const m = ctx?.month ?? month;
      setLoading(true);
      setError(null);
      try {
        const [fRes, oRes] = await Promise.all([
          fetch(`/api/fixed?year=${y}&month=${m}`),
          fetch(`/api/off?year=${y}&month=${m}`),
        ]);
        const [fJson, oJson] = await Promise.all([
          safeJSON<FixedAssignment[]>(fRes),
          safeJSON<OffDay[]>(oRes),
        ]);
        setFixed(fJson);
        setOff(oJson);
      } catch (e: any) {
        setError(e?.message || 'load failed');
      } finally {
        setLoading(false);
      }
    },
    [month, year],
  );

  const createFixed = useCallback(
    async (payload: Omit<FixedAssignment, 'id'>) => {
      const res = await fetch('/api/fixed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await safeJSON<{ ok: boolean; item: FixedAssignment }>(res);
      setFixed((prev) => [...prev, json.item]);
      await load({ year, month });
      return json.item;
    },
    [load, month, year],
  );

  const updateFixed = useCallback(
    async (id: number, payload: Partial<FixedAssignment>) => {
      const res = await fetch(`/api/fixed/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await safeJSON<{ ok: boolean; item: FixedAssignment }>(res);
      setFixed((prev) => prev.map((f) => (f.id === id ? json.item : f)));
      await load({ year, month });
      return json.item;
    },
    [load, month, year],
  );

  const deleteFixed = useCallback(
    async (id: number) => {
      await fetch(`/api/fixed/${id}`, { method: 'DELETE' });
      setFixed((prev) => prev.filter((f) => f.id !== id));
      await load({ year, month });
    },
    [load, month, year],
  );

  const createOff = useCallback(
    async (payload: Omit<OffDay, 'id'>) => {
      const res = await fetch('/api/off', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await safeJSON<{ ok: boolean; item: OffDay }>(res);
      setOff((prev) => [...prev, json.item]);
      await load({ year, month });
      return json.item;
    },
    [load, month, year],
  );

  const deleteOff = useCallback(
    async (id: number) => {
      await fetch(`/api/off/${id}`, { method: 'DELETE' });
      setOff((prev) => prev.filter((o) => o.id !== id));
      await load({ year, month });
    },
    [load, month, year],
  );

  return {
    fixed,
    off,
    loading,
    error,
    load,
    createFixed,
    updateFixed,
    deleteFixed,
    createOff,
    deleteOff,
  };
}


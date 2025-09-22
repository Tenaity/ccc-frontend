import { test } from 'vitest';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { useScheduleData } from '../src/hooks/useScheduleData';

function ok(json: any) {
  return { ok: true, text: async () => JSON.stringify(json) } as any;
}

test('onGenerate is blocked when validation fails', async () => {
  const calls: string[] = [];
  global.fetch = async (url: string) => {
    calls.push(url);
    if (url.startsWith('/api/schedule/validate')) return ok({ ok: false, conflicts: [{ day: '2025-09-04', type: 'OFFDAY_VS_FIXED' }] });
    if (url.startsWith('/api/staff')) return ok([]);
    if (url.startsWith('/api/assignments')) return ok([]);
    if (url.startsWith('/api/fixed')) return ok([]);
    if (url.startsWith('/api/offdays')) return ok([]);
    if (url.startsWith('/api/holidays')) return ok([]);
    if (url.startsWith('/api/schedule/estimate')) return ok({});
    if (url.startsWith('/api/rules/expected')) return ok({ ok: true, perDayExpected: {} });
    if (url.startsWith('/api/schedule/generate')) return ok({ ok: true, planned: [] });
    return ok({});
  };

  let hook: any;
  function Wrapper() {
    hook = useScheduleData(2025, 9);
    return null;
  }

  await act(async () => { create(<Wrapper />); });
  calls.length = 0;
  await act(async () => { await hook.onGenerate(); });
  assert(calls.includes('/api/schedule/validate?year=2025&month=9'));
  assert(!calls.some(u => u.startsWith('/api/schedule/generate')));
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { useScheduleData } from '../useScheduleData';

function ok(json: any) {
  return { ok: true, text: async () => JSON.stringify(json) } as any;
}

test('useScheduleData flags leader duplicates', async () => {
  global.fetch = async (url: string) => {
    if (url.startsWith('/api/schedule/validate')) return ok({ ok: false, conflicts: { leader_day_dup: [{ day: '2025-09-01', ids: [1, 2] }] } });
    if (url.startsWith('/api/staff')) return ok([]);
    if (url.startsWith('/api/assignments')) return ok([]);
    if (url.startsWith('/api/fixed')) return ok([]);
    if (url.startsWith('/api/offdays')) return ok([]);
    if (url.startsWith('/api/schedule/estimate')) return ok({});
    if (url.startsWith('/api/rules/expected')) return ok({ ok: true, perDayExpected: {} });
    return ok({});
  };
  let hook: any;
  function Wrapper() {
    hook = useScheduleData(2025, 9);
    return null;
  }
  await act(async () => { create(React.createElement(Wrapper)); });
  assert.strictEqual(hook.hasLeaderDup, true);
  assert.strictEqual(hook.validation.ok, false);
});

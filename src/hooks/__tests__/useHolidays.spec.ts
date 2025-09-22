import { test, beforeEach } from 'vitest';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create } from 'react-test-renderer';

import { useHolidays } from '../useHolidays';

function ok(json: any) {
  return { ok: true, text: async () => JSON.stringify(json) } as any;
}

let holidaysStore: any[] = [
  { id: 1, day: '2025-09-02', name: 'Independence' },
];

beforeEach(() => {
  holidaysStore = [{ id: 1, day: '2025-09-02', name: 'Independence' }];
});

global.fetch = (async (input: RequestInfo | URL, opts?: any) => {
  const url = typeof input === 'string' ? input : input.toString();
  if (url.startsWith('/api/holidays?')) {
    return ok(holidaysStore);
  }
  if (url === '/api/holidays' && opts?.method === 'POST') {
    const body = JSON.parse(opts.body);
    const item = { id: 42, ...body };
    holidaysStore.push(item);
    return ok({ ok: true, item });
  }
  if (url.startsWith('/api/holidays/') && opts?.method === 'DELETE') {
    const id = Number(url.split('/').pop());
    holidaysStore = holidaysStore.filter((holiday) => holiday.id !== id);
    return ok({ ok: true });
  }
  return ok({});
}) as any;

test('useHolidays load and mutate', async () => {
  let hook: any;
  function Wrapper() {
    hook = useHolidays(2025, 9);
    return null;
  }

  await act(async () => {
    create(React.createElement(Wrapper));
  });

  await act(async () => {
    await hook.load();
  });
  assert.equal(hook.holidays.length, 1);

  await act(async () => {
    await hook.createHoliday({ day: '2025-09-03', name: 'Test' });
  });
  assert.equal(hook.holidays.length, 2);

  await act(async () => {
    await hook.deleteHoliday(1);
  });
  assert.equal(hook.holidays.length, 1);
});


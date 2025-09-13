import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { useFixedOff } from '../useFixedOff';

function ok(json: any) {
  return { ok: true, text: async () => JSON.stringify(json) } as any;
}

let fixedStore: any[] = [
  { id: 1, staff_id: 1, day: '2025-09-01', shift_code: 'CA1', position: null },
];
let offStore: any[] = [
  { id: 1, staff_id: 2, day: '2025-09-02', reason: null },
];

global.fetch = (async (input: RequestInfo | URL, opts?: any) => {
  const url = typeof input === 'string' ? input : input.toString();
  if (url.startsWith('/api/fixed?')) return ok(fixedStore);
  if (url.startsWith('/api/off?')) return ok(offStore);
  if (url === '/api/fixed' && opts?.method === 'POST') {
    const body = JSON.parse(opts.body);
    const item = { id: 99, ...body };
    fixedStore.push(item);
    return ok({ ok: true, item });
  }
  if (url.startsWith('/api/fixed/') && opts?.method === 'PUT') {
    const id = Number(url.split('/').pop());
    const body = JSON.parse(opts.body);
    fixedStore = fixedStore.map((f) => (f.id === id ? { ...f, ...body } : f));
    const item = fixedStore.find((f) => f.id === id);
    return ok({ ok: true, item });
  }
  if (url.startsWith('/api/fixed/') && opts?.method === 'DELETE') {
    const id = Number(url.split('/').pop());
    fixedStore = fixedStore.filter((f) => f.id !== id);
    return ok({ ok: true });
  }
  if (url === '/api/off' && opts?.method === 'POST') {
    const body = JSON.parse(opts.body);
    const item = { id: 77, ...body };
    offStore.push(item);
    return ok({ ok: true, item });
  }
  if (url.startsWith('/api/off/') && opts?.method === 'DELETE') {
    const id = Number(url.split('/').pop());
    offStore = offStore.filter((o) => o.id !== id);
    return ok({ ok: true });
  }
  return ok({});
}) as any;

test('useFixedOff load and mutate', async () => {
  let hook: any;
  function Wrapper() {
    hook = useFixedOff(2025, 9);
    return null;
  }
  await act(async () => { create(React.createElement(Wrapper)); });
  await act(async () => { await hook.load(); });
  assert.equal(hook.fixed.length, 1);
  assert.equal(hook.off.length, 1);

  await act(async () => {
    await hook.createFixed({ staff_id: 3, day: '2025-09-03', shift_code: 'CA2', position: null });
  });
  assert.equal(hook.fixed.length, 2);

  await act(async () => {
    await hook.updateFixed(1, { shift_code: 'CA2' });
  });
  assert.equal(hook.fixed.find((f: any) => f.id === 1)?.shift_code, 'CA2');

  await act(async () => {
    await hook.createOff({ staff_id: 4, day: '2025-09-04', reason: null });
  });
  assert.equal(hook.off.length, 2);

  await act(async () => {
    await hook.deleteOff(1);
  });
  assert.equal(hook.off.length, 1);
});

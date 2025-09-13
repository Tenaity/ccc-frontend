import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create } from 'react-test-renderer';
import QuickEditDialog from '../src/components/QuickEditDialog';

const staffA = { id: 1, full_name: 'Alice', role: 'TC', can_night: true, base_quota: 5 } as any;
const staffB = { id: 2, full_name: 'Bob', role: 'TC', can_night: true, base_quota: 5 } as any;

function ok(body: any) {
  return { ok: true, json: async () => body } as any;
}

test('dialog fetches and displays reasons', async () => {
  let url = '';
  const origFetch = global.fetch;
  global.fetch = async (u: string) => {
    url = u;
    return ok({ ok: false, reasons: ['lock', 'quota'] });
  };

  let inst: any;
  await act(async () => {
    inst = create(
      <QuickEditDialog
        open={true}
        day="2025-09-01"
        current={staffA}
        candidates={[staffA, staffB]}
        onClose={() => {}}
      />
    );
  });

  const select = inst.root.findByType('select');
  await act(async () => {
    select.props.onChange({ target: { value: '2' } });
  });
  await act(async () => {});

  assert.equal(url, '/api/schedule/validate?day=2025-09-01&staff_id=2');
  const items = inst.root.findAll((n: any) => n.type === 'li');
  const texts = items.map((n: any) => n.children.join(''));
  assert.deepEqual(texts, ['lock', 'quota']);

  global.fetch = origFetch;
});

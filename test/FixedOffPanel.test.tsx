import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create } from 'react-test-renderer';
import FixedOffPanel from '../src/components/fixed-off/FixedOffPanel';

function ok(json: any) {
  return { ok: true, text: async () => JSON.stringify(json) } as any;
}

// stub fetch for staff/fixed/off
(global as any).fetch = async (url: any) => {
  const u = String(url);
  if (u.startsWith('/api/staff')) return ok([{ id: 1, full_name: 'Alice' }]);
  if (u.startsWith('/api/fixed')) return ok([]);
  if (u.startsWith('/api/off')) return ok([]);
  return ok({});
};

test('FixedOffPanel renders with tabs', async () => {
  let tree: any;
  await act(async () => {
    tree = create(
      <FixedOffPanel year={2025} month={9} open={true} onClose={() => {}} />
    );
  });
  assert.ok(tree.root);
});

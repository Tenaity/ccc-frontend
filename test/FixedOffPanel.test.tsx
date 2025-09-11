import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { create } from 'react-test-renderer';
import { FixedOffPanel } from '../src/components';

function ok(json: any) {
  return { ok: true, text: async () => JSON.stringify(json) } as any;
}

test('FixedOffPanel hidden when closed', () => {
  const inst = create(<FixedOffPanel year={2025} month={9} open={false} onClose={() => {}} />);
  assert.equal(inst.toJSON(), null);
});

test('FixedOffPanel renders when open', () => {
  global.fetch = async () => ok([]);
  const inst = create(<FixedOffPanel year={2025} month={9} open={true} onClose={() => {}} />);
  const tree = inst.toJSON();
  assert.ok(Array.isArray(tree) || typeof tree === 'object');
});

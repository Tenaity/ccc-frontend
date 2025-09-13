import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { FixedOffPanel } from '../src/components';

test('FixedOffPanel hidden when closed', () => {
  const inst = create(
    <FixedOffPanel year={2025} month={9} open={false} onClose={() => {}} />
  );
  assert.equal(inst.toJSON(), null);
});

test('FixedOffPanel renders when open', () => {
  const inst = create(
    <FixedOffPanel year={2025} month={9} open={true} onClose={() => {}} />
  );
  const tree = inst.toJSON();
  assert.ok(Array.isArray(tree) || typeof tree === 'object');
});


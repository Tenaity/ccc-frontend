import { test } from 'vitest';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create } from 'react-test-renderer';
import Toolbar from '../src/components/Toolbar';

test('export button triggers handler', async () => {
  let called = false;
  const tree = create(
    <Toolbar
      onGenerate={() => {}}
      onValidate={() => {}}
      onExport={() => { called = true; }}
      onFixedOff={() => {}}
    />
  );
  const btn = tree.root.findByProps({ 'data-testid': 'btn-export' });
  await act(async () => { btn.props.onClick(); });
  assert.equal(called, true);
});

test('export button shows loading state', () => {
  const tree = create(
    <Toolbar
      onGenerate={() => {}}
      onValidate={() => {}}
      onExport={() => {}}
      onFixedOff={() => {}}
      exporting
    />
  );
  const btn = tree.root.findByProps({ 'data-testid': 'btn-export' });
  assert.equal(btn.props.disabled, true);
  assert.equal(btn.props.children, 'Đang xuất...');
});

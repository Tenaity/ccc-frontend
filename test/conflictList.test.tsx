import { test } from 'vitest';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import ConflictList from '../src/components/ConflictList';

test('conflict list renders entries', () => {
  const html = renderToString(<ConflictList conflicts={[{ day: '2025-09-04', type: 'OFFDAY_VS_FIXED' }]} />);
  assert(html.includes('OFFDAY_VS_FIXED'));
});

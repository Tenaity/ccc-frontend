import { test } from 'vitest';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Badge from '../src/components/Badge';

test('badge shows border based on rank', () => {
  const r1 = renderToStaticMarkup(<Badge code="CA1" rank={1} />);
  const r2 = renderToStaticMarkup(<Badge code="CA1" rank={2} />);
  assert(r1.includes('2px solid'));
  assert(r2.includes('1.5px dashed'));
});

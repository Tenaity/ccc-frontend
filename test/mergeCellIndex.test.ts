import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCellIndex } from '../src/utils/mergeCellIndex';
import type { Assignment, FixedAssignment, OffDay } from '../src/types';

test('assignment only is reflected', () => {
  const a: Assignment[] = [{ staff_id: 1, day: '2024-06-01', shift_code: 'CA1', position: null }];
  const idx = buildCellIndex(a, [], []);
  assert.deepEqual(idx.get('1|2024-06-01'), { code: 'CA1', position: null });
});

test('fixed overrides assignment', () => {
  const a: Assignment[] = [{ staff_id: 1, day: '2024-06-01', shift_code: 'CA1', position: null }];
  const f: FixedAssignment[] = [{ id:1, staff_id: 1, day: '2024-06-01', shift_code: 'CA2', position: null }];
  const idx = buildCellIndex(a, f, []);
  assert.deepEqual(idx.get('1|2024-06-01'), { code: 'CA2', position: null });
});

test('off overrides fixed and assignment', () => {
  const a: Assignment[] = [{ staff_id: 1, day: '2024-06-01', shift_code: 'CA1', position: null }];
  const f: FixedAssignment[] = [{ id:1, staff_id: 1, day: '2024-06-01', shift_code: 'CA2', position: null }];
  const o: OffDay[] = [{ id:1, staff_id:1, day:'2024-06-01' }];
  const idx = buildCellIndex(a, f, o);
  assert.deepEqual(idx.get('1|2024-06-01'), { code: 'P', position: null });
});

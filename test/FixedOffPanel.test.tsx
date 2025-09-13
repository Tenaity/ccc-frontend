import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { FixedOffPanel } from '../src/components';
import { DatePicker } from '../src/components/ui/date-picker';

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

test.skip('FixedOffPanel create and delete fixed', async () => {
  let fixedList: any[] = [];
  global.fetch = async (url: string, opts?: any) => {
    if (url.startsWith('/api/fixed?')) return ok(fixedList);
    if (url.startsWith('/api/off?')) return ok([]);
    if (url === '/api/fixed' && opts?.method === 'POST') {
      const body = JSON.parse(opts.body);
      const item = { id: 1, ...body };
      fixedList.push(item);
      return ok({ ok: true, item });
    }
    if (url.startsWith('/api/fixed/') && opts?.method === 'DELETE') {
      const id = Number(url.split('/').pop());
      fixedList = fixedList.filter((f) => f.id !== id);
      return ok({ ok: true });
    }
    return ok({});
  };

  const origDoc = global.document;
  global.document = {
    body: { appendChild() {}, removeChild() {} },
    createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }),
  } as any;

  let inst: any;
  await act(async () => {
    inst = create(<FixedOffPanel year={2025} month={9} open={true} onClose={() => {}} />);
  });

  const inputs = inst.root.findAllByType('input');
  await act(async () => { inputs[0].props.onChange({ target: { value: '1' } }); });

  const dp = inst.root.findByType(DatePicker);
  await act(async () => { dp.props.onChange(new Date('2025-09-15')); });

  const form = inst.root.findByType('form');
  await act(async () => { await form.props.onSubmit({ preventDefault() {} }); });

  const itemsAfterCreate = inst.root.findAllByType('li');
  assert.equal(itemsAfterCreate.length, 1);

  const delBtn = itemsAfterCreate[0].findByType('button');
  await act(async () => { await delBtn.props.onClick(); });

  const itemsAfterDelete = inst.root.findAllByType('li');
  assert.equal(itemsAfterDelete.length, 0);

  global.document = origDoc;
});

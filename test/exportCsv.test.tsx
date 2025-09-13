import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create } from 'react-test-renderer';
import CalendarHeader from '../src/components/CalendarHeader';
import { exportMonthCsv } from '../src/utils/exportCsv';

function okBlob(content: string) {
  return {
    ok: true,
    blob: async () => new Blob([content], { type: 'text/csv' }),
  } as any;
}

test('exportMonthCsv downloads CSV', async () => {
  let clicked = false;
  const origFetch = global.fetch;
  const origCreateObj = global.URL.createObjectURL;
  const origRevokeObj = global.URL.revokeObjectURL;
  const origDoc = global.document;

  global.fetch = async (url: string) => {
    assert.equal(url, '/api/export/month.csv?year=2025&month=9');
    return okBlob('a,b');
  };
  (global.URL as any).createObjectURL = () => 'blob:mock';
  (global.URL as any).revokeObjectURL = () => {};
  global.document = {
    createElement: () => ({ click: () => { clicked = true; }, set href(v) {}, set download(v) {} }),
  } as any;

  await exportMonthCsv(2025, 9);
  assert.ok(clicked);

  global.fetch = origFetch;
  (global.URL as any).createObjectURL = origCreateObj;
  (global.URL as any).revokeObjectURL = origRevokeObj;
  global.document = origDoc;
});

test('exportMonthCsv throws on error', async () => {
  const origFetch = global.fetch;
  global.fetch = async () => ({ ok: false, text: async () => 'fail' }) as any;
  await assert.rejects(exportMonthCsv(2025, 9), /fail/);
  global.fetch = origFetch;
});

test('CalendarHeader renders export button and triggers fetch', async () => {
  let url = '';
  const origFetch = global.fetch;
  const origDoc = global.document;
  const origCreateObj = global.URL.createObjectURL;
  const origRevokeObj = global.URL.revokeObjectURL;

  global.fetch = async (u: string) => {
    url = u;
    return okBlob('x');
  };
  (global.URL as any).createObjectURL = () => 'blob:test';
  (global.URL as any).revokeObjectURL = () => {};
  global.document = {
    createElement: () => ({ click() {}, set href(v) {}, set download(v) {} }),
  } as any;

  let inst: any;
  await act(async () => {
    inst = create(
      <CalendarHeader
        year={2025}
        month={9}
        setYear={() => {}}
        setMonth={() => {}}
        loading={false}
        onGenerate={() => {}}
        onShuffle={() => {}}
        onSave={() => {}}
        onResetSoft={() => {}}
        onResetHard={() => {}}
        onExport={() => exportMonthCsv(2025, 9)}
        fillHC={false}
        setFillHC={() => {}}
        canGenerate={true}
        onOpenFixedOff={() => {}}
      />
    );
  });

  const btn = inst.root.findAll((n: any) => n.type === 'button' && n.children.includes('Export CSV'))[0];
  assert.ok(btn, 'button exists');
  await act(async () => { btn.props.onClick(); });
  assert.equal(url, '/api/export/month.csv?year=2025&month=9');

  global.fetch = origFetch;
  global.document = origDoc;
  (global.URL as any).createObjectURL = origCreateObj;
  (global.URL as any).revokeObjectURL = origRevokeObj;
});

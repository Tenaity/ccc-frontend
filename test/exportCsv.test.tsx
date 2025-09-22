import { test, vi } from 'vitest';
import assert from 'node:assert/strict';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarHeader from '../src/components/CalendarHeader';
import { TooltipProvider } from '../src/components/ui/tooltip';
import { ToastStateProvider, useToast } from '../src/components/ui/use-toast';
import { exportMonthCsv } from '../src/utils/exportCsv';
import { useExportCsv } from '../src/hooks/useExportCsv';

function okBlob(content: string) {
  return {
    ok: true,
    text: async () => content,
    blob: async () => new Blob([content], { type: 'text/csv' }),
    headers: { get: () => 'text/csv' },
  } as any;
}

function ExportHarness() {
  const { exportCsv, isExporting } = useExportCsv();
  const { toasts } = useToast();
  return (
    <div>
      <button type="button" onClick={() => exportCsv(2025, 9)} disabled={isExporting}>
        {isExporting ? 'Đang xuất...' : 'Export now'}
      </button>
      <ul>
        {toasts.map((toast) => (
          <li key={toast.id}>
            <span>{toast.title}</span>
            {toast.description ? <span> · {toast.description}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

test('exportMonthCsv downloads CSV', async () => {
  let clicked = false;
  let filename = '';
  const origFetch = global.fetch;
  const origCreateObj = global.URL.createObjectURL;
  const origRevokeObj = global.URL.revokeObjectURL;
  const originalCreateElement = document.createElement.bind(document);
  const createElementSpy = vi
    .spyOn(document, 'createElement')
    .mockImplementation(<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) => {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'a') {
        const anchor = element as unknown as HTMLAnchorElement;
        Object.defineProperty(anchor, 'download', {
          configurable: true,
          get: () => filename,
          set: (value: string) => {
            filename = value;
          },
        });
        anchor.click = () => {
          clicked = true;
        };
      }
      return element;
    });

  global.fetch = async (url: string) => {
    assert.equal(url, '/api/export/month.csv?year=2025&month=9');
    return okBlob('Day,Staff\n2025-09-01,Alice');
  };
  (global.URL as any).createObjectURL = () => 'blob:mock';
  (global.URL as any).revokeObjectURL = () => {};

  const rows = await exportMonthCsv(2025, 9);
  assert.ok(clicked);
  assert.equal(filename, 'schedule-2025-09.csv');
  assert.equal(rows, 1);

  global.fetch = origFetch;
  (global.URL as any).createObjectURL = origCreateObj;
  (global.URL as any).revokeObjectURL = origRevokeObj;
  createElementSpy.mockRestore();
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
  const origCreateObj = global.URL.createObjectURL;
  const origRevokeObj = global.URL.revokeObjectURL;
  const originalCreateElement = document.createElement.bind(document);
  const createElementSpy = vi
    .spyOn(document, 'createElement')
    .mockImplementation(<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) => {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'a') {
        (element as unknown as HTMLAnchorElement).click = () => {};
      }
      return element;
    });

  global.fetch = async (u: string) => {
    url = u;
    return okBlob('Day,Staff\n2025-09-01,A');
  };
  (global.URL as any).createObjectURL = () => 'blob:test';
  (global.URL as any).revokeObjectURL = () => {};

  const user = userEvent.setup();
  render(
    <TooltipProvider delayDuration={150} skipDelayDuration={0} disableHoverableContent>
      <ToastStateProvider>
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
      </ToastStateProvider>
    </TooltipProvider>
  );

  const button = screen.getByRole('button', { name: /Export CSV/i });
  await user.click(button);
  await waitFor(() => {
    assert.equal(url, '/api/export/month.csv?year=2025&month=9');
  });

  global.fetch = origFetch;
  (global.URL as any).createObjectURL = origCreateObj;
  (global.URL as any).revokeObjectURL = origRevokeObj;
  createElementSpy.mockRestore();
});

test('useExportCsv shows success toast', async () => {
  const origFetch = global.fetch;
  const origCreateObj = global.URL.createObjectURL;
  const origRevokeObj = global.URL.revokeObjectURL;
  const originalCreateElement = document.createElement.bind(document);
  const createElementSpy = vi
    .spyOn(document, 'createElement')
    .mockImplementation(<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) => {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'a') {
        (element as unknown as HTMLAnchorElement).click = () => {};
      }
      return element;
    });

  global.fetch = async (url: string) => {
    assert.equal(url, '/api/export/month.csv?year=2025&month=9');
    return okBlob('Day,Staff\n2025-09-01,Alice');
  };
  (global.URL as any).createObjectURL = () => 'blob:harness';
  (global.URL as any).revokeObjectURL = () => {};

  const user = userEvent.setup();
  render(
    <ToastStateProvider>
      <ExportHarness />
    </ToastStateProvider>,
  );

  const button = screen.getByRole('button', { name: /Export now/i });
  await user.click(button);
  await waitFor(() => {
    assert.ok(screen.getByText(/Export success/));
  });

  global.fetch = origFetch;
  (global.URL as any).createObjectURL = origCreateObj;
  (global.URL as any).revokeObjectURL = origRevokeObj;
  createElementSpy.mockRestore();
});

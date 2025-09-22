import React from 'react'
import { beforeAll, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import App from '../src/App'
import { UiProvider } from '../src/components/ui/UiProvider'

vi.mock('../src/hooks/useScheduleData', () => ({
  useScheduleData: () => ({
    staff: [],
    assignments: [],
    setAssignments: vi.fn(),
    loadingGen: false,
    validation: { ok: true, conflicts: [] },
    hasLeaderDup: false,
    days: [],
    assignmentIndex: new Map(),
    fixedByDay: {},
    offByDay: {},
    fixedByDayStaff: new Map(),
    offByDayStaff: new Map(),
    summariesByStaffId: new Map(),
    perDayCounts: {},
    perDayLeaders: {},
    perDayDayNight: {},
    leaderErrors: [],
    perDayByPlace: {},
    onGenerate: vi.fn(),
    onShuffle: vi.fn(),
    onSave: vi.fn(),
    onResetSoft: vi.fn(),
    onResetHard: vi.fn(),
    fetchFixed: vi.fn(),
    fetchOffdays: vi.fn(),
    fetchValidate: vi.fn(),
    estimate: null,
    loadingEstimate: false,
    estimateError: null,
    fetchEstimate: vi.fn(),
    expectedByDay: {},
    loadingExpected: false,
    expectedError: null,
    fillHC: false,
    setFillHC: vi.fn(),
  }),
}))

vi.mock('../src/components/fixed-off', () => ({
  FixedOffPanel: () => null,
}))

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

test('App renders inside UiProvider without crashing', () => {
  render(
    <UiProvider>
      <App />
    </UiProvider>,
  )

  expect(screen.getByText('Lịch phân ca dạng ma trận')).toBeInTheDocument()
})

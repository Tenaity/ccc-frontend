import React from 'react'
import { beforeAll, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'

import App from '../src/App'
import { UiProvider } from '../src/components/ui/UiProvider'

vi.mock('../src/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}))

vi.mock('../src/pages/Dashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard" />,
}))

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
    onGenerate: vi.fn().mockResolvedValue({ ok: true, conflicts: [] }),
    onShuffle: vi.fn(),
    onSave: vi.fn(),
    onResetSoft: vi.fn(),
    onResetHard: vi.fn(),
    fetchStaff: vi.fn(),
    fetchFixed: vi.fn(),
    fetchOffdays: vi.fn(),
    fetchHolidays: vi.fn(),
    fetchValidate: vi.fn().mockResolvedValue({ ok: true, conflicts: [] }),
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
      <HashRouter>
        <App />
      </HashRouter>
    </UiProvider>,
  )

  expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
})

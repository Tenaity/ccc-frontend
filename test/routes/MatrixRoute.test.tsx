import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import MatrixRoute from '../../src/routes/MatrixRoute'
import type { DayPlaceSummary, ExpectedByDay } from '../../src/types'
import type { Cell } from '../../src/utils/mergeCellIndex'

vi.mock('@/components/CalendarHeader', () => ({
  __esModule: true,
  default: ({ year, month, onGenerate, onOpenFixedOff }: any) => (
    <div data-testid="calendar-header">
      header-{year}-{month}
      <button onClick={onGenerate}>header-generate</button>
      <button onClick={onOpenFixedOff}>header-fixed</button>
    </div>
  ),
}))

vi.mock('@/components/Toolbar', () => ({
  __esModule: true,
  default: ({ onGenerate, onFixedOff, onValidate, onExport, exporting }: any) => (
    <div>
      <button onClick={onGenerate}>toolbar-generate</button>
      <button onClick={onFixedOff}>toolbar-fixed</button>
      <button onClick={onValidate}>toolbar-validate</button>
      <button onClick={onExport} disabled={exporting}>
        toolbar-export
      </button>
    </div>
  ),
}))

vi.mock('@/components/ConflictList', () => ({
  __esModule: true,
  default: ({ conflicts }: { conflicts: any[] }) => (
    <div data-testid="conflict-count">{conflicts.length}</div>
  ),
}))

vi.mock('@/components/Matrix/MatrixTable', () => ({
  __esModule: true,
  default: ({ staff }: { staff: any[] }) => <div data-testid="matrix-table">rows-{staff.length}</div>,
}))

describe('MatrixRoute', () => {
  it('renders matrix header and forwards actions', () => {
    const onGenerate = vi.fn()
    const onShuffle = vi.fn()
    const onSave = vi.fn()
    const onResetSoft = vi.fn()
    const onResetHard = vi.fn()
    const onExport = vi.fn()
    const setYear = vi.fn()
    const setMonth = vi.fn()
    const onValidate = vi.fn()
    const onOpenFixedOff = vi.fn()

    const perDayByPlace: Record<number, DayPlaceSummary> = { 1: { TD: { K: 0, CA1: 0, CA2: 0, D: 0 }, PGD: { K: 0, CA2: 0, D: 0 } } }
    const expectedByDay: ExpectedByDay = {}
    const assignmentIndex = new Map<string, Cell>()
    const fixedByDayStaff = new Map<string, boolean>()
    const offByDayStaff = new Map<string, boolean>()
    const summariesByStaffId = new Map<number, { counts: Record<string, number>; credit: number; dayCount: number; nightCount: number }>()

    render(
      <MatrixRoute
        year={2024}
        month={9}
        setYear={setYear}
        setMonth={setMonth}
        loadingGen={false}
        onGenerate={onGenerate}
        onShuffle={onShuffle}
        onSave={onSave}
        onResetSoft={onResetSoft}
        onResetHard={onResetHard}
        onExport={onExport}
        exporting={false}
        fillHC={false}
        setFillHC={vi.fn()}
        canGenerate
        onValidate={onValidate}
        onOpenFixedOff={onOpenFixedOff}
        days={[1]}
        staff={[]}
        assignmentIndex={assignmentIndex}
        summariesByStaffId={summariesByStaffId}
        perDayLeaders={{ 1: 1 }}
        perDayByPlace={perDayByPlace}
        expectedByDay={expectedByDay}
        fixedByDayStaff={fixedByDayStaff}
        offByDayStaff={offByDayStaff}
        matrixLoading={false}
        matrixError={null}
        fetchStaff={vi.fn()}
        validationConflicts={[{ id: 1 }, { id: 2 }]}
      />,
    )

    expect(screen.getByRole('heading', { name: /ma trận phân ca/i })).toBeInTheDocument()
    expect(screen.getByTestId('conflict-count')).toHaveTextContent('2')

    fireEvent.click(screen.getByText('header-generate'))
    fireEvent.click(screen.getByText('toolbar-generate'))
    fireEvent.click(screen.getByText('toolbar-fixed'))
    fireEvent.click(screen.getByText('header-fixed'))
    fireEvent.click(screen.getByText('toolbar-validate'))
    fireEvent.click(screen.getByText('toolbar-export'))

    expect(onGenerate).toHaveBeenCalledTimes(2)
    expect(onOpenFixedOff).toHaveBeenCalledTimes(2)
    expect(onValidate).toHaveBeenCalledTimes(1)
    expect(onExport).toHaveBeenCalledTimes(1)
  })
})

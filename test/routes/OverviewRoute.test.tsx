import React from 'react'
import { render, screen } from '@testing-library/react'

import OverviewRoute from '../../src/routes/OverviewRoute'

vi.mock('../../src/components/Estimate/EstimatePanel', () => ({
  __esModule: true,
  default: ({ loading, error }: { loading?: boolean; error?: string | null }) => (
    <div data-testid="estimate-panel">{loading ? 'loading' : error ?? 'ready'}</div>
  ),
}))

describe('OverviewRoute', () => {
  it('renders summary and warnings', () => {
    render(
      <OverviewRoute
        estimate={null}
        loadingEstimate={false}
        estimateError={null}
        leaderErrors={[{ day: 1, count: 0 }, { day: 2, count: 2 }]}
        hasLeaderDup
      />,
    )

    expect(screen.getByRole('heading', { name: /tổng quan nhu cầu/i })).toBeInTheDocument()
    expect(screen.getByText(/có 2 ngày không đúng số lượng/i)).toBeInTheDocument()
    expect(screen.getByTestId('estimate-panel')).toHaveTextContent('ready')
    expect(screen.getByText(/có ngày có >1 trưởng ca/i)).toBeInTheDocument()
  })
})

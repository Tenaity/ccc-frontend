import '@testing-library/jest-dom/vitest'
import { expect, vi } from 'vitest'
import { toHaveNoViolations } from 'vitest-axe/matchers'

expect.extend({ toHaveNoViolations })

type MatchMedia = (query: string) => {
  matches: boolean
  media: string
  onchange: null
  addListener: (listener: () => void) => void
  removeListener: (listener: () => void) => void
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
  dispatchEvent: () => boolean
}

const matchMediaMock: MatchMedia = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(() => false),
}))

vi.stubGlobal('matchMedia', matchMediaMock)

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMediaMock,
  })
}

vi.mock('html2canvas', () => ({ default: vi.fn(async () => ({})) }), { virtual: true })
vi.mock(
  'react-chartjs-2',
  () => ({
    Bar: () => null,
    Line: () => null,
  }),
  { virtual: true },
)
vi.mock('chart.js', () => ({}), { virtual: true })
vi.mock('chart.js/auto', () => ({}), { virtual: true })

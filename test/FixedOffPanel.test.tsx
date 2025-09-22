import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { type ComponentProps } from 'react'
import { render, screen, waitFor, fireEvent, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

import type { FixedAssignment, Holiday, OffDay, Staff } from '../src/types'

// Mock DatePicker to simplify date input interactions in tests.
type MockDatePickerProps = {
  value?: Date
  onChange: (date: Date | undefined) => void
} & Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'type'>

vi.mock('@/components/ui/date-picker', () => {
  const DatePicker = ({ value, onChange, ...props }: MockDatePickerProps) => (
    <input
      type="date"
      {...props}
      value={value ? value.toISOString().slice(0, 10) : ''}
      onChange={event => {
        const nextValue = event.currentTarget.value
        onChange(nextValue ? new Date(`${nextValue}T00:00:00`) : undefined)
      }}
    />
  )

  return { DatePicker }
})

vi.mock('@/components/ui/tabs', () => {
  const React = require('react') as typeof import('react')

  type TabsContextValue = {
    value: string
    onValueChange?: (next: string) => void
  }

  const TabsContext = React.createContext<TabsContextValue | null>(null)

  type TabsProps = React.PropsWithChildren<
    {
      value?: string
      defaultValue?: string
      onValueChange?: (next: string) => void
    } & React.HTMLAttributes<HTMLDivElement>
  >

  const Tabs = ({ value, defaultValue, onValueChange, children, ...props }: TabsProps) => {
    const [internalValue, setInternalValue] = React.useState(() => value ?? defaultValue ?? '')
    const currentValue = value ?? internalValue

    const handleChange = (next: string) => {
      onValueChange?.(next)
      if (value === undefined) {
        setInternalValue(next)
      }
    }

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
        <div role="presentation" {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }

  const TabsList = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div role="tablist" {...props}>
      {children}
    </div>
  )

  const TabsTrigger = ({ value, children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) => {
    const ctx = React.useContext(TabsContext)
    const isActive = ctx ? ctx.value === value : value === props['data-state']

    return (
      <button
        type="button"
        role="tab"
        data-state={isActive ? 'active' : 'inactive'}
        aria-selected={isActive}
        onClick={event => {
          onClick?.(event)
          if (!event.defaultPrevented && ctx) {
            ctx.onValueChange?.(value)
          }
        }}
        {...props}
      >
        {children}
      </button>
    )
  }

  const TabsContent = ({ value, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) => {
    const ctx = React.useContext(TabsContext)
    if (ctx && ctx.value !== value) {
      return null
    }

    return (
      <div role="tabpanel" data-state="active" {...props}>
        {children}
      </div>
    )
  }

  return { Tabs, TabsList, TabsTrigger, TabsContent }
})

vi.mock('@/components/ui/dialog', () => {
  const Dialog = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

  const DialogContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div role="dialog" {...props}>
      {children}
    </div>
  )

  const DialogHeader = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  )

  const DialogTitle = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props}>{children}</h2>
  )

  const DialogDescription = ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props}>{children}</p>
  )

  const DialogClose = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  )

  return { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose }
})

vi.mock('@/components/ui/select', () => {
  const React = require('react') as typeof import('react')

  type Option = { value: string; label: React.ReactNode }

  type SelectContextValue = {
    value?: string
    disabled?: boolean
    onValueChange?: (next: string) => void
    options: Option[]
    registerOption: (option: Option) => void
    placeholder?: string
    setPlaceholder: (text?: string) => void
  }

  const SelectContext = React.createContext<SelectContextValue | null>(null)

  type SelectProps = {
    value?: string
    onValueChange?: (next: string) => void
    disabled?: boolean
    children: React.ReactNode
  }

  const toText = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node)
    }
    if (Array.isArray(node)) {
      return node.map(toText).join('')
    }
    if (React.isValidElement(node)) {
      return toText(node.props.children)
    }
    return ''
  }

  const Select = ({ value, onValueChange, disabled, children }: SelectProps) => {
    const [options, setOptions] = React.useState<Option[]>([])
    const [placeholder, setPlaceholder] = React.useState<string | undefined>(undefined)

    const registerOption = React.useCallback((option: Option) => {
      setOptions(prev => {
        if (prev.some(item => item.value === option.value)) {
          return prev
        }
        return [...prev, option]
      })
    }, [])

    const contextValue = React.useMemo<SelectContextValue>(
      () => ({
        value,
        disabled,
        onValueChange,
        options,
        registerOption,
        placeholder,
        setPlaceholder,
      }),
      [value, disabled, onValueChange, options, registerOption, placeholder]
    )

    return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>
  }

  const SelectTrigger = React.forwardRef<
    HTMLSelectElement,
    React.SelectHTMLAttributes<HTMLSelectElement>
  >(({ children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext)
    if (!ctx) {
      return (
        <select ref={ref} {...props}>
          {children}
        </select>
      )
    }

    return (
      <select
        ref={ref}
        role="combobox"
        value={ctx.value ?? ''}
        disabled={ctx.disabled}
        onChange={event => ctx.onValueChange?.(event.target.value)}
        {...props}
      >
        {ctx.placeholder ? (
          <option value="" disabled>
            {ctx.placeholder}
          </option>
        ) : null}
        {ctx.options.map(option => (
          <option key={option.value} value={option.value}>
            {toText(option.label)}
          </option>
        ))}
      </select>
    )
  })

  const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>

  const SelectValue = ({ placeholder, children }: { placeholder?: string; children?: React.ReactNode }) => {
    const ctx = React.useContext(SelectContext)
    React.useEffect(() => {
      if (placeholder) {
        ctx?.setPlaceholder(placeholder)
      }
    }, [ctx, placeholder])
    return <span>{children}</span>
  }

  const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
    const ctx = React.useContext(SelectContext)
    React.useEffect(() => {
      ctx?.registerOption({ value, label: children })
    }, [ctx, value, children])
    return null
  }

  const noop = () => null

  return {
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectItem,
    SelectGroup: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectSeparator: noop,
    SelectScrollUpButton: noop,
    SelectScrollDownButton: noop,
    SelectLabel: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
  }
})

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  ),
}))

vi.mock('@/components/ui/separator', () => ({
  Separator: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => <hr {...props} />,
}))

import FixedOffPanel from '../src/components/fixed-off/FixedOffPanel'

const staffFixtures: Staff[] = [
  {
    id: 1,
    full_name: 'Alice Nguyễn',
    role: 'TC',
    can_night: true,
    base_quota: 20,
    notes: null,
  },
  {
    id: 2,
    full_name: 'Bob Trần',
    role: 'GDV',
    can_night: false,
    base_quota: 18,
    notes: null,
  },
]

const initialFixedAssignments: FixedAssignment[] = [
  {
    id: 1,
    staff_id: 1,
    day: '2025-09-01',
    shift_code: 'CA1',
    position: null,
    note: null,
  },
]

const initialOffDays: OffDay[] = []
const initialHolidays: Holiday[] = [
  { id: 1, day: '2025-09-02', name: 'Quốc khánh' },
]

function createMockServer() {
  let fixedAssignments = initialFixedAssignments.map(item => ({ ...item }))
  let offDays = initialOffDays.map(item => ({ ...item }))
  let holidays = initialHolidays.map(item => ({ ...item }))
  let nextFixedId = initialFixedAssignments.length + 1
  let nextHolidayId = initialHolidays.length + 1

  return setupServer(
    http.get('/api/staff', () => HttpResponse.json(staffFixtures)),
    http.get('/api/fixed', () => HttpResponse.json(fixedAssignments)),
    http.get('/api/off', () => HttpResponse.json(offDays)),
    http.get('/api/holidays', () => HttpResponse.json(holidays)),
    http.post('/api/fixed', async ({ request }) => {
      const payload = (await request.json()) as Omit<FixedAssignment, 'id'>
      const item: FixedAssignment = { ...payload, id: nextFixedId++ }
      fixedAssignments = [...fixedAssignments, item]
      return HttpResponse.json({ ok: true, item })
    }),
    http.delete('/api/fixed/:id', ({ params }) => {
      const id = Number(params.id)
      fixedAssignments = fixedAssignments.filter(item => item.id !== id)
      return HttpResponse.json({ ok: true })
    }),
    http.post('/api/holidays', async ({ request }) => {
      const payload = (await request.json()) as Omit<Holiday, 'id'>
      const existing = holidays.find(item => item.day === payload.day)
      if (existing) {
        return HttpResponse.json({ ok: true, item: existing })
      }
      const item: Holiday = { ...payload, id: nextHolidayId++ }
      holidays = [...holidays, item]
      return HttpResponse.json({ ok: true, item })
    }),
    http.delete('/api/holidays/:id', ({ params }) => {
      const id = Number(params.id)
      holidays = holidays.filter(item => item.id !== id)
      return HttpResponse.json({ ok: true })
    }),
  )
}

function renderPanel(overrides?: Partial<ComponentProps<typeof FixedOffPanel>>) {
  const props: ComponentProps<typeof FixedOffPanel> = {
    year: 2025,
    month: 9,
    open: true,
    onClose: vi.fn(),
    ...overrides,
  }

  render(<FixedOffPanel {...props} />)
}

describe('FixedOffPanel', () => {
  test('loads staff options and fixed assignments when opened', async () => {
    const server = createMockServer()
    server.listen({ onUnhandledRequest: 'error' })

    try {
      renderPanel()

      const staffSelect = await screen.findByLabelText('Nhân viên')
      await waitFor(() => {
        expect(within(staffSelect).getByRole('option', { name: 'Alice Nguyễn' })).toBeInTheDocument()
      })

      expect(await screen.findByText('#1 · CA1')).toBeInTheDocument()
    } finally {
      server.close()
      cleanup()
    }
  })

  test('creates a fixed assignment and notifies callbacks', async () => {
    const server = createMockServer()
    server.listen({ onUnhandledRequest: 'error' })

    try {
      const user = userEvent.setup()
      const onClose = vi.fn()
      const onRefresh = vi.fn().mockResolvedValue(undefined)
      const onToast = vi.fn()

      renderPanel({ onClose, onRefresh, onToast })

      const staffSelect = await screen.findByLabelText('Nhân viên')
      await waitFor(() => {
        expect(within(staffSelect).getByRole('option', { name: 'Bob Trần' })).toBeInTheDocument()
      })
      await user.selectOptions(staffSelect, '2')
      await waitFor(() => expect(staffSelect).toHaveValue('2'))

      const dayInput = screen.getByLabelText('Ngày')
      fireEvent.input(dayInput, { target: { value: '2025-09-10' } })

      const shiftSelect = screen.getByLabelText('Mã ca')
      await user.selectOptions(shiftSelect, 'CA2')
      await waitFor(() => expect(shiftSelect).toHaveValue('CA2'))

      const submitButton = screen.getByRole('button', { name: 'Thêm ca cố định' })
      await waitFor(() => expect(submitButton).toBeEnabled())

      await user.click(submitButton)

      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalledTimes(1)
      })
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(onToast).toHaveBeenCalledWith('Đã lưu ca cố định', { title: 'Thành công' })

      expect(await screen.findByText('#2 · CA2')).toBeInTheDocument()
    } finally {
      server.close()
      cleanup()
    }
  })

  test('creates a holiday and shows toast', async () => {
    const server = createMockServer()
    server.listen({ onUnhandledRequest: 'error' })

    try {
      const user = userEvent.setup()
      const onToast = vi.fn()
      const onRefresh = vi.fn().mockResolvedValue(undefined)

      renderPanel({ onToast, onRefresh })

      const holidayTab = screen.getByRole('tab', { name: 'Ngày lễ' })
      await user.click(holidayTab)

      const dayInput = await screen.findByLabelText('Ngày lễ')
      fireEvent.input(dayInput, { target: { value: '2025-09-05' } })

      const nameInput = screen.getByLabelText('Tên ngày lễ')
      fireEvent.input(nameInput, { target: { value: 'Team building' } })

      const submitButton = screen.getByRole('button', { name: 'Thêm ngày lễ' })
      await waitFor(() => expect(submitButton).toBeEnabled())

      await user.click(submitButton)

      await waitFor(() => {
        expect(onToast).toHaveBeenCalledWith('Đã lưu ngày lễ', { title: 'Thành công' })
      })
      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalled()
      })

      expect(await screen.findByText('2025-09-05')).toBeInTheDocument()
      expect(await screen.findByText(/Team building/)).toBeInTheDocument()
    } finally {
      server.close()
      cleanup()
    }
  })

  test('deletes a fixed assignment and refreshes the list', async () => {
    const server = createMockServer()
    server.listen({ onUnhandledRequest: 'error' })

    try {
      const user = userEvent.setup()
      const onRefresh = vi.fn().mockResolvedValue(undefined)
      const onToast = vi.fn()

      renderPanel({ onRefresh, onToast })

      expect(await screen.findByText('#1 · CA1')).toBeInTheDocument()

      const deleteButton = await screen.findByRole('button', { name: 'Xóa' })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalledTimes(1)
      })
      await waitFor(() => {
        expect(onToast).toHaveBeenCalledWith('Đã xóa ca cố định', { title: 'Đã xóa' })
      })

      expect(await screen.findByText('Chưa có ca cố định.')).toBeInTheDocument()
    } finally {
      server.close()
      cleanup()
    }
  })
})

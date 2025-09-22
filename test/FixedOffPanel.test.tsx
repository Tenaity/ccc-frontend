import { beforeEach, expect, test, vi } from 'vitest';
import React from 'react';
import { act, create } from 'react-test-renderer';
import FixedOffPanel from '../src/components/fixed-off/FixedOffPanel';

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (callback: any) => callback,
    reset: () => {},
    formState: { isValid: true },
  }),
}));

vi.mock('@/hooks/useFixedOff', () => ({
  useFixedOff: () => ({
    fixed: [],
    off: [],
    load: () => Promise.resolve(),
    createFixed: async () => {},
    deleteFixed: async () => {},
    createOff: async () => {},
    deleteOff: async () => {},
  }),
}));

vi.mock('@/components/ui/tabs', () => {
  type TabsContextValue = {
    value: string;
    onValueChange?: (value: string) => void;
  };
  const TabsContext = React.createContext<TabsContextValue | null>(null);

  const Tabs = ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
  }) => {
    return (
      <TabsContext.Provider value={{ value, onValueChange }}>
        <div role="presentation">{children}</div>
      </TabsContext.Provider>
    );
  };

  const TabsList = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div role="tablist" {...props}>
      {children}
    </div>
  );

  const TabsTrigger = ({
    value,
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) => {
    const ctx = React.useContext(TabsContext);
    const isActive = ctx?.value === value;
    return (
      <button
        type="button"
        role="tab"
        data-state={isActive ? 'active' : 'inactive'}
        aria-selected={isActive}
        onClick={() => ctx?.onValueChange?.(value)}
        {...props}
      >
        {children}
      </button>
    );
  };

  const TabsContent = ({
    value,
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { value: string }) => {
    const ctx = React.useContext(TabsContext);
    if (ctx?.value !== value) {
      return null;
    }
    return (
      <div role="tabpanel" data-state="active" {...props}>
        {children}
      </div>
    );
  };

  return {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  };
});

vi.mock('@/components/ui/dialog', () => {
  const Dialog = ({ children }: { children: React.ReactNode }) => (
    <div data-dialog="root">{children}</div>
  );
  const DialogContent = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <div role="dialog" {...props}>
      {children}
    </div>
  );
  const DialogHeader = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;
  const DialogTitle = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props}>{children}</h2>
  );
  const DialogDescription = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props}>{children}</p>
  );
  const DialogClose = ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  );

  return {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
  };
});

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock('@/components/ui/select', () => {
  const Select = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const SelectTrigger = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  );
  const SelectContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const SelectItem = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) => (
    <div role="option" {...props}>
      {children}
    </div>
  );
  const SelectValue = ({ children }: { children?: React.ReactNode }) => <span>{children}</span>;
  return { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
});

vi.mock('@/components/ui/form', () => {
  const Form = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  const FormField = ({ render }: { render: (args: any) => React.ReactNode }) => (
    <>{render({ field: { value: '', onChange: () => {} }, fieldState: {}, formState: {} })}</>
  );
  const FormItem = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const FormLabel = ({ children }: { children: React.ReactNode }) => <label>{children}</label>;
  const FormControl = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  const FormMessage = () => null;
  return { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };
});

vi.mock('@/components/ui/date-picker', () => ({
  DatePicker: () => <div data-testid="date-picker" />,
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/separator', () => ({
  Separator: () => <hr />,
}));

beforeEach(() => {
  document.body.innerHTML = '';
});

function ok(json: any) {
  return {
    ok: true,
    text: async () => JSON.stringify(json),
    json: async () => json,
  } as any;
}

// stub fetch for staff/fixed/off
(global as any).fetch = async (url: any) => {
  const u = String(url);
  if (u.startsWith('/api/staff')) return ok([{ id: 1, full_name: 'Alice' }]);
  if (u.startsWith('/api/fixed')) return ok([]);
  if (u.startsWith('/api/off')) return ok([]);
  return ok({});
};

test('FixedOffPanel renders with tabs', async () => {
  let inst: any;
  await act(async () => {
    inst = create(
      <FixedOffPanel year={2025} month={9} open={true} onClose={() => {}} />
    );
  });

  const title = inst.root.findAll((node: any) => node.type === 'h2');
  expect(title.some((node: any) => node.props.children === 'Fixed & Off')).toBe(true);

  const tabs = inst.root.findAll((node: any) => node.props.role === 'tab');
  expect(tabs.length).toBeGreaterThanOrEqual(2);
  expect(tabs[0].props['data-state']).toBe('active');

  await act(async () => {
    tabs[1].props.onClick?.();
  });

  const updatedTabs = inst.root.findAll((node: any) => node.props.role === 'tab');
  expect(updatedTabs[1].props['data-state']).toBe('active');
});

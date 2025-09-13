import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFixedOff } from '@/hooks/useFixedOff';
import type { ShiftCode, Position } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';

export default function FixedOffPanel({
  year,
  month,
  open,
  onClose,
  onToast,
}: {
  year: number;
  month: number;
  open: boolean;
  onClose: () => void;
  onToast?: (msg: string) => void;
}) {
  const { fixed, off, load, createFixed, deleteFixed, createOff, deleteOff } = useFixedOff(year, month);
  const [tab, setTab] = useState<'fixed' | 'off'>('fixed');

  const fixedForm = useForm<{ staffId: string; day: Date | undefined; shift: ShiftCode; position: Position | '' }>({
    defaultValues: { staffId: '', day: undefined, shift: 'CA1', position: '' },
  });

  const offForm = useForm<{ staffId: string; day: Date | undefined; reason: string }>({
    defaultValues: { staffId: '', day: undefined, reason: '' },
  });

  useEffect(() => {
    if (open) load();
  }, [open, year, month]);

  if (!open) return null;

  const submitFixed = fixedForm.handleSubmit(async (values) => {
    try {
      await createFixed({
        staff_id: Number(values.staffId),
        day: values.day?.toISOString().slice(0, 10) || '',
        shift_code: values.shift,
        position: values.position || null,
      });
      onToast?.('Saved');
    } catch (e: any) {
      onToast?.(e?.message || 'Save failed');
    }
  });

  const submitOff = offForm.handleSubmit(async (values) => {
    try {
      await createOff({
        staff_id: Number(values.staffId),
        day: values.day?.toISOString().slice(0, 10) || '',
        reason: values.reason || null,
      });
      onToast?.('Saved');
    } catch (e: any) {
      onToast?.(e?.message || 'Save failed');
    }
  });

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-80 sm:w-96" side="right">
        <SheetHeader>
          <SheetTitle>Fixed & Off</SheetTitle>
        </SheetHeader>
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'fixed' | 'off')} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="fixed">Fixed</TabsTrigger>
            <TabsTrigger value="off">Off</TabsTrigger>
          </TabsList>
          <TabsContent value="fixed" className="mt-4 space-y-4">
            <Form {...fixedForm}>
              <form onSubmit={submitFixed} className="space-y-3">
                <FormField
                  control={fixedForm.control}
                  name="staffId"
                  rules={{ required: 'Required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staff ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={fixedForm.control}
                  name="day"
                  rules={{ required: 'Required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={fixedForm.control}
                  name="shift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shift</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CA1">CA1</SelectItem>
                          <SelectItem value="CA2">CA2</SelectItem>
                          <SelectItem value="K">K</SelectItem>
                          <SelectItem value="HC">HC</SelectItem>
                          <SelectItem value="Đ">Đ</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={fixedForm.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="--" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">--</SelectItem>
                          <SelectItem value="TD">TD</SelectItem>
                          <SelectItem value="PGD">PGD</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button type="submit">Add</Button>
              </form>
            </Form>
            <ul className="space-y-2 text-sm">
              {fixed.map((f) => (
                <li key={f.id} className="flex items-center justify-between">
                  <span>
                    {f.day} #{f.staff_id} {f.shift_code} {f.position || ''}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      try {
                        await deleteFixed(f.id);
                        onToast?.('Deleted');
                      } catch (e: any) {
                        onToast?.(e?.message || 'Delete failed');
                      }
                    }}
                  >
                    Del
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="off" className="mt-4 space-y-4">
            <Form {...offForm}>
              <form onSubmit={submitOff} className="space-y-3">
                <FormField
                  control={offForm.control}
                  name="staffId"
                  rules={{ required: 'Required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staff ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={offForm.control}
                  name="day"
                  rules={{ required: 'Required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day</FormLabel>
                      <FormControl>
                        <DatePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={offForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit">Add</Button>
              </form>
            </Form>
            <ul className="space-y-2 text-sm">
              {off.map((o) => (
                <li key={o.id} className="flex items-center justify-between">
                  <span>
                    {o.day} #{o.staff_id} {o.reason || ''}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      try {
                        await deleteOff(o.id);
                        onToast?.('Deleted');
                      } catch (e: any) {
                        onToast?.(e?.message || 'Delete failed');
                      }
                    }}
                  >
                    Del
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

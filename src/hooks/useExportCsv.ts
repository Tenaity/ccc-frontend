import { useCallback, useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { exportMonthCsv } from '@/utils/exportCsv';

export function useExportCsv() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const runExport = useCallback(
    async (year: number, month: number) => {
      setIsExporting(true);
      try {
        const rows = await exportMonthCsv(year, month);
        const description = rows > 0 ? `${rows} dòng dữ liệu` : 'Không có dữ liệu';
        toast({ title: 'Export success', description });
        return rows;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Không thể xuất file.';
        toast({
          variant: 'destructive',
          title: 'Export CSV thất bại',
          description: message,
        });
        throw error;
      } finally {
        setIsExporting(false);
      }
    },
    [toast],
  );

  return {
    isExporting,
    exportCsv: runExport,
  };
}


import React from 'react';
import { Button } from '@/components/ui/button';

export default function Toolbar({
  onGenerate,
  onValidate,
  onExport,
  onFixedOff,
  disabled,
  exporting = false,
}: {
  onGenerate: () => void;
  onValidate: () => void;
  onExport: () => void;
  onFixedOff: () => void;
  disabled?: boolean;
  exporting?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button onClick={onGenerate} disabled={disabled}>Generate</Button>
      <Button variant="outline" onClick={onValidate} disabled={disabled}>Validate</Button>
      <Button variant="secondary" onClick={onExport} data-testid="btn-export" disabled={disabled || exporting}>
        {exporting ? 'Đang xuất...' : 'Export CSV'}
      </Button>
      <Button onClick={onFixedOff} disabled={disabled}>Fixed/Off/Holiday</Button>
    </div>
  );
}

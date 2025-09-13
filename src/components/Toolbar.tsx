import React from 'react';
import { Button } from '@/components/ui/button';

export default function Toolbar({
  onGenerate,
  onValidate,
  onExport,
  onFixedOff,
  disabled,
}: {
  onGenerate: () => void;
  onValidate: () => void;
  onExport: () => void;
  onFixedOff: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button onClick={onGenerate} disabled={disabled}>Generate</Button>
      <Button variant="outline" onClick={onValidate} disabled={disabled}>Validate</Button>
      <Button variant="secondary" onClick={onExport} data-testid="btn-export" disabled={disabled}>
        Export CSV
      </Button>
      <Button onClick={onFixedOff} disabled={disabled}>Fixed/Off</Button>
    </div>
  );
}

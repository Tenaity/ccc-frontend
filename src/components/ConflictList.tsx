import React from "react";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Conflict = {
  day?: string;
  type?: string;
  message?: string;
  detail?: string;
  [key: string]: unknown;
};

function formatConflict(conflict: Conflict) {
  const dayLabel = conflict.day ? `Ngày ${conflict.day}` : "Không rõ ngày";
  const typeLabel = conflict.type ? conflict.type.replace(/_/g, " ") : "không rõ loại";
  const extra = conflict.message ?? conflict.detail;
  return extra ? `${dayLabel}: ${typeLabel} – ${extra}` : `${dayLabel}: ${typeLabel}`;
}

export default function ConflictList({ conflicts }: { conflicts: Conflict[] }) {
  if (!Array.isArray(conflicts) || conflicts.length === 0) {
    return null;
  }

  return (
    <Alert
      variant="destructive"
      className="space-y-3 text-sm"
      aria-live="assertive"
      role="alert"
    >
      <div className="flex items-center gap-2 text-destructive">
        <TriangleAlert className="h-5 w-5" aria-hidden="true" />
        <AlertTitle className="m-0">Cảnh báo xung đột</AlertTitle>
      </div>
      <AlertDescription className="text-destructive">
        Có {conflicts.length} xung đột cần được xử lý.
      </AlertDescription>
      <ul
        className="list-disc space-y-1 pl-5 text-destructive"
        aria-label="Danh sách xung đột lịch"
      >
        {conflicts.map((conflict, index) => (
          <li key={`${conflict.day ?? "unknown"}-${conflict.type ?? index}`}>{formatConflict(conflict)}</li>
        ))}
      </ul>
    </Alert>
  );
}

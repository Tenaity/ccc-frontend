import React, { useEffect, useState } from "react";
import type { Staff } from "../types";

/**
 * QuickEditDialog: allow manually overriding a cell assignment.
 *
 * Props:
 * - open: whether dialog is visible
 * - day: ISO date string "YYYY-MM-DD" of the cell
 * - current: current staff of the cell
 * - candidates: staff options to assign
 * - fixed: whether the cell is fixed (locked) and cannot be changed
 * - onClose: called when dialog requests close
 *
 * NOTE: Assign action is scaffold only; API call is TODO.
 */
export default function QuickEditDialog({
  open,
  day,
  current,
  candidates,
  fixed,
  onClose,
}: {
  open: boolean;
  day: string;
  current: Staff;
  candidates: Staff[];
  fixed?: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<number>(current.id);
  const [reasons, setReasons] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    async function run() {
      try {
        const res = await fetch(
          `/api/schedule/validate?day=${day}&staff_id=${selected}`
        );
        const body = await res.json();
        setReasons(body.reasons || []);
      } catch (e) {
        setReasons(["network"]);
      }
    }
    run();
  }, [open, day, selected]);

  const disabled = reasons.length > 0;

  if (!open) return null;
  return (
    <div role="dialog" className="p-4 border rounded bg-white">
      <h2 className="font-bold mb-2">Quick Edit</h2>
      <div className="mb-2">Current: {current.full_name}</div>
      {fixed && <div className="mb-2 text-red-600">Fixed</div>}
      <select
        className="border p-1 mb-2 w-full"
        value={selected}
        onChange={(e) => setSelected(Number(e.target.value))}
      >
        {candidates.map((c) => (
          <option key={c.id} value={c.id}>
            {c.full_name}
          </option>
        ))}
      </select>
      {reasons.length > 0 && (
        <ul className="mb-2 list-disc list-inside text-sm text-red-600">
          {reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 justify-end">
        <button
          className="px-3 py-1 border rounded"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="px-3 py-1 border rounded bg-blue-500 text-white disabled:bg-gray-300"
          disabled={disabled}
          onClick={() => {
            // TODO: submit assignment
            onClose();
          }}
        >
          Assign
        </button>
      </div>
    </div>
  );
}

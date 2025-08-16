// src/components/schedule/ControlBar.tsx
import React from "react";
import { useScheduleData } from "../../hooks/useScheduleData";

export default function ControlBar({
    year, month,
    onGenerate, onShuffle, onSave,
    fillHC, setFillHC,
    loading,
}: {
    year: number; month: number;
    onGenerate: (opts?: { shuffle?: boolean }) => Promise<void>;
    onShuffle: () => Promise<void>;
    onSave: () => Promise<void>;
    fillHC: boolean;
    setFillHC: (v: boolean) => void;
    loading: boolean;
}) {
    return (
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                    type="checkbox"
                    checked={fillHC}
                    onChange={e => setFillHC(e.target.checked)}
                />
                <span>
                    Tự động bù <b>HC</b> để đủ quota tháng (áp dụng cho Generate & Shuffle)
                </span>
            </label>

            <button disabled={loading} onClick={() => onGenerate()}>
                Generate
            </button>
            <button disabled={loading} onClick={() => onShuffle()}>
                Shuffle
            </button>
            <button disabled={loading} onClick={() => onSave()}>
                Save
            </button>
        </div>
    );
}
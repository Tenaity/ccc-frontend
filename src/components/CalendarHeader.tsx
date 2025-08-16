import React from "react";

export default function CalendarHeader({
    year, month, setYear, setMonth, loading,
    onGenerate, onShuffle, onSave, onResetSoft, onResetHard,
    fillHC, setFillHC,   // 👈 NEW
}: {
    year: number; month: number;
    setYear: (y: number) => void; setMonth: (m: number) => void;
    loading: boolean;
    onGenerate: () => void; onShuffle: () => void; onSave: () => void;
    onResetSoft: () => void; onResetHard: () => void;
    fillHC: boolean;                 // 👈 NEW
    setFillHC: (v: boolean) => void; // 👈 NEW
}) {
    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <label>Năm:</label>
            <input type="number" value={year} onChange={e => setYear(+e.target.value)} style={{ width: 100 }} />
            <label>Tháng:</label>
            <input type="number" min={1} max={12} value={month} onChange={e => setMonth(+e.target.value)} style={{ width: 80 }} />

            {/* 👇 NEW: Toggle auto fill HC */}
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
                <input
                    type="checkbox"
                    checked={fillHC}
                    onChange={e => setFillHC(e.target.checked)}
                    disabled={loading}
                />
                Tự động bù HC khi Generate/Shuffle
            </label>

            <button onClick={onGenerate} disabled={loading} style={{ padding: "6px 12px" }}>
                {loading ? "Đang tạo..." : "Generate (Preview)"}
            </button>

            <button onClick={onShuffle} disabled={loading} style={{ padding: "6px 12px" }}>
                {loading ? "…" : "Shuffle (Preview)"}
            </button>

            <button onClick={onSave} disabled={loading} style={{ padding: "6px 12px", background: "#16a34a", color: "#fff", border: "0", borderRadius: 6 }}>
                {loading ? "Đang lưu..." : "Save"}
            </button>

            <button onClick={onResetSoft} disabled={loading} style={{ padding: "6px 12px", marginLeft: 8 }}>
                Reset lịch (soft)
            </button>
            <button onClick={onResetHard} disabled={loading} style={{ padding: "6px 12px" }}>
                Reset DB (hard)
            </button>

            <span style={{ marginLeft: 12, fontSize: 12, color: "#666" }}>
                * Generate/Shuffle chỉ <b>preview</b>, không lưu DB. Bấm <b>Save</b> để ghi lịch.
            </span>
        </div>
    );
}
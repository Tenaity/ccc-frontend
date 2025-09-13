import React, { useState } from "react";
import CalendarHeader from "./components/CalendarHeader";
import Legend from "./components/Legend";
import MatrixTable from "./components/Matrix/MatrixTable";
import EstimatePanel from "./components/Estimate/EstimatePanel";
import ConflictList from "./components/ConflictList";
import { useScheduleData } from "./hooks/useScheduleData";
import { FixedOffPanel } from "./components/fixed-off";
import Toast from "./components/Toast";
import { exportMonthCsv } from "./utils/exportCsv";

export default function App() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [showFixedOff, setShowFixedOff] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const {
        staff, loadingGen, days,
        assignmentIndex, fixedByDayStaff, offByDayStaff,
        summariesByStaffId, perDayLeaders, perDayByPlace, leaderErrors,
        estimate, loadingEstimate, estimateError,
        onGenerate, onShuffle, onSave, onResetSoft, onResetHard,
        fillHC, setFillHC,
        expectedByDay,
        validation,
        hasLeaderDup,
    } = useScheduleData(year, month);

    const onExport = async () => {
        try {
            await exportMonthCsv(year, month);
        } catch (err: any) {
            setToast(err?.message || "Export failed");
        }
    };

    return (
        <div style={{ fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial", padding: 16 }}>
            <h1 style={{ marginBottom: 8 }}>Lịch phân ca dạng ma trận</h1>
            <EstimatePanel data={estimate} loading={loadingEstimate} error={estimateError} />

            {leaderErrors.length > 0 && (
                <div style={{ marginBottom: 12, padding: 10, border: "1px solid #f59e0b", background: "#FFFBEB", borderRadius: 8 }}>
                    <strong>Cảnh báo:</strong> Có {leaderErrors.length} ngày không đúng số lượng <em>Trưởng ca ngày</em> (K, position=TD).{" "}
                    {leaderErrors.slice(0, 10).map(e => <code key={e.day} style={{ marginRight: 6 }}>D{e.day}: {e.count}</code>)}
                    {leaderErrors.length > 10 ? "…" : ""}
                </div>
            )}

            {hasLeaderDup && (
                <div style={{ marginBottom: 12, padding: 10, border: "1px solid #f87171", background: "#FEF2F2", borderRadius: 8 }}>
                    <strong>Cảnh báo:</strong> Có ngày có &gt;1 trưởng ca
                </div>
            )}

            <CalendarHeader
                year={year} month={month}
                setYear={setYear} setMonth={setMonth}
                loading={loadingGen}
                onGenerate={onGenerate} onShuffle={onShuffle}
                onSave={onSave}
                onResetSoft={onResetSoft} onResetHard={onResetHard}
                onExport={onExport}
                fillHC={fillHC} setFillHC={setFillHC}
                canGenerate={validation.ok}
                onOpenFixedOff={() => setShowFixedOff(true)}
            />

            <ConflictList conflicts={validation.conflicts} />

            <MatrixTable
                year={year}
                month={month}
                days={days}
                staff={staff}
                assignmentIndex={assignmentIndex}
                summariesByStaffId={summariesByStaffId}
                perDayLeaders={perDayLeaders}
                perDayByPlace={perDayByPlace}
                expectedByDay={expectedByDay}
                fixedByDayStaff={fixedByDayStaff}
                offByDayStaff={offByDayStaff}
            />

            <FixedOffPanel
                year={year}
                month={month}
                open={showFixedOff}
                onClose={() => setShowFixedOff(false)}
                onToast={(m) => setToast(m)}
            />

            <div style={{ marginTop: 10, fontSize: 12, color: "#555" }}>
                <strong>Chú giải:</strong>{" "}
                <Legend label="CA1" bg="#E6F0FF" />{" "}
                <Legend label="CA2" bg="#FFE8CC" />{" "}
                <Legend label="K" bg="#E6FFEA" />{" "}
                <Legend label="HC" bg="#EDEBFF" />{" "}
                <Legend label="Đ" bg="#FFE6EA" />{" "}
                <Legend label="P" bg="#EEE" />{" "}
                <Legend label="T7/CN" bg="#FFF7CC" />{" "}
                <Legend label="PGD (đỏ)" bg="#F7D1D1" />{" "}
                <Legend label="K trắng (T7)" bg="#FFFFFF" />{" "}
                <Legend label="TC ngày (K + 👑, position=TD)" bg="#E6FFEA" />{" "}
                <Legend label="TC đêm (Đ + 👑, position=TD & role=TC)" bg="#FFE6EA" />
            </div>
            <Toast msg={toast} onDone={() => setToast(null)} />
        </div>
    );
}

import React from "react";
import { DOW_LABEL } from "../../utils/schedule";
import { getDow, isWeekend } from "../../utils/date";

const th = { position: "sticky" as const, top: 0, background: "#f2f4f7", borderBottom: "1px solid #e5e7eb", padding: "6px 8px", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" as const, zIndex: 1, textAlign: "center" as const };
const thSmall = { ...th, fontWeight: 500, fontSize: 11, padding: "4px 6px", top: 28 };
const thMini = { ...th, fontWeight: 500, fontSize: 10, padding: "2px 4px", top: 52 };
const thWeekend = { background: "#FFF7CC" };
const thStickyLeft = { ...th, left: 0, zIndex: 2, textAlign: "left" as const };

export default function MatrixHeader({
    year, month, days, perDayLeaders
}: {
    year: number; month: number; days: number[];
    perDayLeaders: Record<number, number>;
}) {
    return (
        <thead>
            <tr>
                <th rowSpan={3} className="sticky-col" style={thStickyLeft}>Nhân viên</th>
                {days.map(d => {
                    const dow = getDow(year, month, d);
                    const wk = isWeekend(dow);
                    const leaders = perDayLeaders[d] ?? 0;
                    const ok = leaders === 1;
                    return (
                        <th key={`d-${d}`} style={{ ...th, ...(wk ? thWeekend : null), position: "relative" }}>
                            {d}
                            <div style={{ position: "absolute", right: 4, top: 2, fontSize: 10 }}>
                                {ok ? "✅" : "⚠️"}
                            </div>
                        </th>
                    );
                })}
                <th rowSpan={3} style={th}>CA1</th>
                <th rowSpan={3} style={th}>CA2</th>
                <th rowSpan={3} style={th}>K</th>
                <th rowSpan={3} style={th}>HC</th>
                <th rowSpan={3} style={th}>Đ</th>
                <th rowSpan={3} style={th}>P</th>
                <th rowSpan={3} style={{ ...th, background: "#eef8ff" }}>Ngày</th>
                <th rowSpan={3} style={{ ...th, background: "#fff7e6" }}>Đêm</th>
                <th rowSpan={3} style={{ ...th, background: "#f9fafb" }}>Tổng công</th>
            </tr>
            <tr>
                {days.map(d => {
                    const dow = getDow(year, month, d);
                    const wk = isWeekend(dow);
                    return <th key={`w-${d}`} style={{ ...thSmall, ...(wk ? thWeekend : null) }}>{DOW_LABEL[dow]}</th>;
                })}
            </tr>
            <tr>
                {days.map(d => {
                    const wk = isWeekend(getDow(year, month, d));
                    const leaders = perDayLeaders[d] ?? 0;
                    return <th key={`leader-${d}`} style={{ ...thMini, ...(wk ? thWeekend : null) }}>K(leader TD): {leaders}</th>;
                })}
            </tr>
        </thead>
    );
}

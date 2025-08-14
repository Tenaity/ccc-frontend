import React from "react";
import { getDow, isWeekend } from "../../utils/date";

const tdCenter = { borderTop: "1px solid #f0f0f0", padding: "6px 8px", textAlign: "center" as const, whiteSpace: "nowrap" as const };
const tdWeekend = { background: "#FFFDF0" };
const tdStickyLeft = { ...tdCenter, position: "sticky" as const, left: 0, zIndex: 1, background: "#fff", textAlign: "left" as const };

export default function TotalsRows({
    year, month, days, perDayCounts, perDayDayNight, perDayLeaders
}: {
    year: number; month: number; days: number[];
    perDayCounts: Record<number, Record<string, number>>;
    perDayDayNight: Record<number, { dayCount: number; nightCount: number }>;
    perDayLeaders: Record<number, number>;
}) {
    return (
        <>
            <tr style={{ background: "#ECEAFF" }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>CA1</td>
                {days.map(d => {
                    const wk = isWeekend(getDow(year, month, d));
                    const val = perDayCounts[d]?.CA1 ?? 0;
                    return <td key={`sum-ca1-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>{val}</td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Tổng ca CA1 theo ngày</td>
            </tr>

            <tr style={{ background: "#FFE9D6" }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>CA2</td>
                {days.map(d => {
                    const wk = isWeekend(getDow(year, month, d));
                    const val = perDayCounts[d]?.CA2 ?? 0;
                    return <td key={`sum-ca2-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>{val}</td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Tổng ca CA2 theo ngày</td>
            </tr>

            <tr style={{ background: "#E7F8EC" }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>K (mọi vị trí)</td>
                {days.map(d => {
                    const wk = isWeekend(getDow(year, month, d));
                    const val = perDayCounts[d]?.K ?? 0;
                    return <td key={`sum-k-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>{val}</td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Tổng ca K (bao gồm K PGD & K_WHITE)</td>
            </tr>

            <tr style={{ background: "#DFF6FF" }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>K (leader TD)</td>
                {days.map(d => {
                    const wk = isWeekend(getDow(year, month, d));
                    const val = perDayLeaders[d] ?? 0;
                    return <td key={`sum-kleader-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null), fontWeight: 700 }}>{val}</td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Phải luôn = 1/ngày</td>
            </tr>

            <tr style={{ background: "#FFE8A3", fontWeight: 700 }}>
                <td className="sticky-col" style={tdStickyLeft}>TỔNG CA ĐÊM</td>
                {days.map(d => {
                    const wk = isWeekend(getDow(year, month, d));
                    const val = perDayDayNight[d]?.nightCount ?? 0;
                    return <td key={`sum-night-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>{val}</td>;
                })}
                <td colSpan={9} />
            </tr>

            <tr style={{ background: "#CDEFC7", fontWeight: 700 }}>
                <td className="sticky-col" style={tdStickyLeft}>TỔNG CA NGÀY</td>
                {days.map(d => {
                    const wk = isWeekend(getDow(year, month, d));
                    const val = perDayDayNight[d]?.dayCount ?? 0;
                    return <td key={`sum-day-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>{val}</td>;
                })}
                <td colSpan={9} />
            </tr>
        </>
    );
}

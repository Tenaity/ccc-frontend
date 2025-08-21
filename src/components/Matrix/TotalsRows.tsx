// src/components/schedule/TotalsRows.tsx
import React from "react";
import { getDow, isWeekend } from "../../utils/date";
import type { ExpectedByDay, DayPlaceSummary } from "../../types";

const tdCenter = { borderTop: "1px solid #f0f0f0", padding: "6px 8px", textAlign: "center" as const, whiteSpace: "nowrap" as const };
const tdWeekend = { background: "#FFFDF0" };
const tdStickyLeft = { ...tdCenter, position: "sticky" as const, left: 0, zIndex: 1, background: "#fff", textAlign: "left" as const };

const BG = {
    sectionTD: "#EAF5FF",
    sectionPGD: "#FFECEC",
    leaderDay: "#E6FFEA",
    dayCA1: "#E6F0FF",
    dayCA2: "#FFE8CC",
    nightTD: "#FFF0F3",
    nightPGD: "#FFE6EA",
    totalTD: "#E8F0F7",
    totalPGD: "#F6EDED",
    totalALL: "#F4F4F5",
};

export default function TotalsRows({
    year, month, days,
    perDayByPlace,           // { [dd]: { TD:{K,CA1,CA2,D}, PGD:{K,CA2,D} } }
    expectedByDay,           // { [dd]: { expectedTD:{K,CA1,CA2,D}, expectedPGD:{K,CA2,D} } }
}: {
    year: number; month: number; days: number[];
    perDayByPlace: Record<number, DayPlaceSummary>;
    expectedByDay: ExpectedByDay;
}) {

    const wstyle = (y: number, m: number, d: number) =>
        (isWeekend(getDow(y, m, d)) ? tdWeekend : {});

    const tdTotal = (p: DayPlaceSummary) => p.TD.K + p.TD.CA1 + p.TD.CA2 + p.TD.D;
    const pgdTotal = (p: DayPlaceSummary) => p.PGD.K + p.PGD.CA2 + p.PGD.D;

    const getExp = (d: number) => expectedByDay?.[d];

    return (
        <>
            {/* ===== TD ===== */}
            <tr style={{ background: BG.sectionTD }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 800 }}>— TỔNG ĐÀI (TD) —</td>
                {days.map(d => <td key={`sep-td-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }} />)}
                <td colSpan={9} />
            </tr>

            {/* TD · K (leader ngày) — planned */}
            <tr style={{ background: BG.leaderDay }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>TD · K 👑 (trưởng ca · ngày)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d];
                    return <td key={`td-k-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p?.TD.K ?? 0}</td>;
                })}
                <td colSpan={9} />
            </tr>
            {/* TD · K (expected) */}
            <tr>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontSize: 12, color: "#6b7280", fontStyle: "italic", background: "#fafafa", borderLeft: "3px dotted #ddd" }}>
                    Chuẩn · TD · K 👑
                </td>
                {days.map(d => <td key={`td-k-exp-${d}`} style={{ ...tdCenter, fontSize: 11, color: "#6b7280", borderTop: 0, paddingTop: 2, paddingBottom: 6 }}>
                    {getExp(d)?.expectedTD?.K ?? "-"}
                </td>)}
                <td colSpan={9} />
            </tr>

            {/* TD · CA1 planned/expected */}
            <tr style={{ background: BG.dayCA1 }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TD · CA1 (ngày)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d];
                    return <td key={`td-ca1-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p?.TD.CA1 ?? 0}</td>;
                })}
                <td colSpan={9} />
            </tr>
            <tr>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontSize: 12, color: "#6b7280", fontStyle: "italic", background: "#fafafa", borderLeft: "3px dotted #ddd" }}>
                    Chuẩn · TD · CA1
                </td>
                {days.map(d => <td key={`td-ca1-exp-${d}`} style={{ ...tdCenter, fontSize: 11, color: "#6b7280", borderTop: 0, paddingTop: 2, paddingBottom: 6 }}>
                    {getExp(d)?.expectedTD?.CA1 ?? "-"}
                </td>)}
                <td colSpan={9} />
            </tr>

            {/* TD · CA2 planned/expected */}
            <tr style={{ background: BG.dayCA2 }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TD · CA2 (ngày)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d];
                    return <td key={`td-ca2-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p?.TD.CA2 ?? 0}</td>;
                })}
                <td colSpan={9} />
            </tr>
            <tr>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontSize: 12, color: "#6b7280", fontStyle: "italic", background: "#fafafa", borderLeft: "3px dotted #ddd" }}>
                    Chuẩn · TD · CA2
                </td>
                {days.map(d => <td key={`td-ca2-exp-${d}`} style={{ ...tdCenter, fontSize: 11, color: "#6b7280", borderTop: 0, paddingTop: 2, paddingBottom: 6 }}>
                    {getExp(d)?.expectedTD?.CA2 ?? "-"}
                </td>)}
                <td colSpan={9} />
            </tr>

            {/* TD · Đ (đêm) planned/expected (gộp leader/white) */}
            <tr style={{ background: BG.nightTD }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TD · Đ (đêm)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d];
                    return <td key={`td-d-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p?.TD.D ?? 0}</td>;
                })}
                <td colSpan={9} />
            </tr>
            <tr>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontSize: 12, color: "#6b7280", fontStyle: "italic", background: "#fafafa", borderLeft: "3px dotted #ddd" }}>
                    Chuẩn · TD · Đ
                </td>
                {days.map(d => <td key={`td-d-exp-${d}`} style={{ ...tdCenter, fontSize: 11, color: "#6b7280", borderTop: 0, paddingTop: 2, paddingBottom: 6 }}>
                    {getExp(d)?.expectedTD?.D ?? "-"}
                </td>)}
                <td colSpan={9} />
            </tr>

            {/* ===== PGD ===== */}
            <tr style={{ background: BG.sectionPGD }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 800 }}>— PHÒNG GIAO DỊCH (PGD) —</td>
                {days.map(d => <td key={`sep-pgd-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }} />)}
                <td colSpan={9} />
            </tr>

            {/* PGD · K planned/expected */}
            <tr style={{ background: "#FFE3E3" }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>PGD · K (ngày)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d];
                    return <td key={`pgd-k-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p?.PGD.K ?? 0}</td>;
                })}
                <td colSpan={9} />
            </tr>
            <tr>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontSize: 12, color: "#6b7280", fontStyle: "italic", background: "#fafafa", borderLeft: "3px dotted #ddd" }}>
                    Chuẩn · PGD · K
                </td>
                {days.map(d => <td key={`pgd-k-exp-${d}`} style={{ ...tdCenter, fontSize: 11, color: "#6b7280", borderTop: 0, paddingTop: 2, paddingBottom: 6 }}>
                    {getExp(d)?.expectedPGD?.K ?? "-"}
                </td>)}
                <td colSpan={9} />
            </tr>

            {/* PGD · CA2 planned/expected */}
            <tr style={{ background: "#FFE8E8" }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>PGD · CA2 (ngày)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d];
                    return <td key={`pgd-ca2-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p?.PGD.CA2 ?? 0}</td>;
                })}
                <td colSpan={9} />
            </tr>
            <tr>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontSize: 12, color: "#6b7280", fontStyle: "italic", background: "#fafafa", borderLeft: "3px dotted #ddd" }}>
                    Chuẩn · PGD · CA2
                </td>
                {days.map(d => <td key={`pgd-ca2-exp-${d}`} style={{ ...tdCenter, fontSize: 11, color: "#6b7280", borderTop: 0, paddingTop: 2, paddingBottom: 6 }}>
                    {getExp(d)?.expectedPGD?.CA2 ?? "-"}
                </td>)}
                <td colSpan={9} />
            </tr>

            {/* PGD · Đ planned/expected */}
            <tr style={{ background: BG.nightPGD }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>PGD · Đ (đêm)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d];
                    return <td key={`pgd-d-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p?.PGD.D ?? 0}</td>;
                })}
                <td colSpan={9} />
            </tr>
            <tr>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontSize: 12, color: "#6b7280", fontStyle: "italic", background: "#fafafa", borderLeft: "3px dotted #ddd" }}>
                    Chuẩn · PGD · Đ
                </td>
                {days.map(d => <td key={`pgd-d-exp-${d}`} style={{ ...tdCenter, fontSize: 11, color: "#6b7280", borderTop: 0, paddingTop: 2, paddingBottom: 6 }}>
                    {getExp(d)?.expectedPGD?.D ?? "-"}
                </td>)}
                <td colSpan={9} />
            </tr>

            {/* ===== Tổng ===== */}
            <tr style={{ background: BG.totalTD, fontWeight: 700 }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TỔNG TD</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d];
                    return <td key={`sum-td-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p ? tdTotal(p) : 0}</td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Tổng nhân sự tại Tổng đài (ngày + đêm)</td>
            </tr>

            <tr style={{ background: BG.totalPGD, fontWeight: 700 }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TỔNG PGD</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d];
                    return <td key={`sum-pgd-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p ? pgdTotal(p) : 0}</td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Tổng nhân sự tại PGD (ngày + đêm)</td>
            </tr>

            <tr style={{ background: BG.totalALL, fontWeight: 800 }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TỔNG (TD + PGD)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d];
                    return <td key={`sum-all-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>
                        {p ? tdTotal(p) + pgdTotal(p) : 0}
                    </td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Tổng nhân sự toàn bộ vị trí</td>
            </tr>
        </>
    );
}
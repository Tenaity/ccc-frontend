// src/components/schedule/TotalsRows.tsx
import React from "react";
import { getDow, isWeekend } from "../../utils/date";
import type { ExpectedPerDay } from "../../hooks/useExpectedRules";
import type { ExpectedByDay } from "../../types";

const tdCenter = { borderTop: "1px solid #f0f0f0", padding: "6px 8px", textAlign: "center" as const, whiteSpace: "nowrap" as const };
const tdWeekend = { background: "#FFFDF0" };
const tdStickyLeft = { ...tdCenter, position: "sticky" as const, left: 0, zIndex: 1, background: "#fff", textAlign: "left" as const };

const EMPTY = {
    TD: { K_leader: 0, K: 0, CA1: 0, CA2: 0 },
    PGD: { K: 0, CA2: 0 },
    NIGHT: { leader: 0, TD_WHITE: 0, PGD: 0 },
    K_WHITE: 0,
};
export type DayPlaceSummary = typeof EMPTY;

export default function TotalsRows({
    year, month, days,
    perDayCounts, perDayDayNight, perDayLeaders,
    perDayByPlace,
    expected, // 👈 NEW
    expectedByDay,
}: {
    year: number; month: number; days: number[];
    perDayCounts: Record<number, Record<string, number>>;
    perDayDayNight: Record<number, { dayCount: number; nightCount: number }>;
    perDayLeaders: Record<number, number>;
    perDayByPlace: Record<number, DayPlaceSummary>;
    expected: ExpectedPerDay; // 👈 NEW
    expectedByDay: ExpectedByDay;
}) {
    const wstyle = (y: number, m: number, d: number) =>
        (isWeekend(getDow(y, m, d)) ? tdWeekend : {});

    const tdTotal = (p: DayPlaceSummary) =>
        p.TD.K_leader + p.TD.K + p.TD.CA1 + p.TD.CA2 + p.NIGHT.leader + p.NIGHT.TD_WHITE + p.K_WHITE;

    const pgdTotal = (p: DayPlaceSummary) =>
        p.PGD.K + p.PGD.CA2 + p.NIGHT.PGD;

    const BG = {
        sectionTD: "#EAF5FF",
        sectionPGD: "#FFECEC",
        leaderDay: "#E6FFEA",
        dayCA1: "#E6F0FF",
        dayCA2: "#FFE8CC",
        leaderNight: "#FFE6EA",
        nightWhite: "#FFF7FA",
        kWhite: "#FFFFFF",
        totalTD: "#E8F0F7",
        totalPGD: "#F6EDED",
        totalALL: "#F4F4F5",
    };


    const ruleCellStyle: React.CSSProperties = {
        ...tdCenter,
        fontSize: 11,
        color: "#6b7280",
        borderTop: "0",
        paddingTop: 2,
        paddingBottom: 6,
    };

    const ruleLabelStyle: React.CSSProperties = {
        ...tdStickyLeft,
        fontSize: 12,
        color: "#6b7280",
        fontStyle: "italic",
        background: "#fafafa",
        borderLeft: "3px dotted #ddd",
    };

    const getExp = (d: number) => expectedByDay?.[d];

    return (
        <>
            {/* ===== TD ===== */}
            <tr style={{ background: BG.sectionTD }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 800 }}>— TỔNG ĐÀI (TD) —</td>
                {days.map(d => <td key={`sep-td-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }} />)}
                <td colSpan={9} />
            </tr>

            {/* TD · K leader (thực tế) */}
            <tr style={{ background: BG.leaderDay }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>TD · K 👑 (trưởng ca · ngày)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`td-klead-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p.TD.K_leader}</td>;
                })}
                <td colSpan={9} />
            </tr>
            {/* TD · K leader (chuẩn) */}
            <tr>
                <td className="sticky-col" style={ruleLabelStyle}>Chuẩn · TD · K 👑</td>
                {days.map(d => {
                    const exp = getExp(d);
                    return <td key={`td-klead-exp-${d}`} style={ruleCellStyle}>{exp?.TD?.K_leader ?? "-"}</td>;
                })}
                <td colSpan={9} />
            </tr>

            {/* TD · CA1 (thực tế) */}
            <tr style={{ background: BG.dayCA1 }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TD · CA1 (ngày)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`td-ca1-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p.TD.CA1}</td>;
                })}
                <td colSpan={9} />
            </tr>
            {/* TD · CA1 (chuẩn) */}
            <tr>
                <td className="sticky-col" style={ruleLabelStyle}>Chuẩn · TD · CA1</td>
                {days.map(d => {
                    const exp = getExp(d);
                    return <td key={`td-ca1-exp-${d}`} style={ruleCellStyle}>{exp?.TD?.CA1 ?? "-"}</td>;
                })}
                <td colSpan={9} />
            </tr>

            {/* TD · CA2 (thực tế) */}
            <tr style={{ background: BG.dayCA2 }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TD · CA2 (ngày)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);

                    return <td key={`td-ca2-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p.TD.CA2}</td>;
                })}
                <td colSpan={9} />
            </tr>
            {/* TD · CA2 (chuẩn) */}
            <tr>
                <td className="sticky-col" style={ruleLabelStyle}>Chuẩn · TD · CA2</td>
                {days.map(d => {
                    const exp = getExp(d);
                    return <td key={`td-ca2-exp-${d}`} style={ruleCellStyle}>{exp?.TD?.CA2 ?? "-"}</td>;
                })}
                <td colSpan={9} />
            </tr>

            {/* TD · Đ leader (thực tế) */}
            <tr style={{ background: BG.leaderNight }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TD · Đ 👑 (trưởng ca · đêm)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`td-d-leader-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p.NIGHT.leader}</td>;
                })}
                <td colSpan={9} />
            </tr>
            {/* TD · Đ leader (chuẩn) */}
            <tr>
                <td className="sticky-col" style={ruleLabelStyle}>Chuẩn · TD · Đ 👑</td>
                {days.map(d => {
                    const exp = getExp(d);
                    return <td key={`td-d-leader-exp-${d}`} style={ruleCellStyle}>{exp?.NIGHT?.leader ?? "-"}</td>;
                })}
                <td colSpan={9} />
            </tr>

            {/* TD · Đ trắng (thực tế) */}
            <tr style={{ background: BG.nightWhite }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TD · Đ trắng (đêm)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`td-d-white-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p.NIGHT.TD_WHITE}</td>;
                })}
                <td colSpan={9} />
            </tr>
            {/* TD · Đ trắng (chuẩn) */}
            <tr>
                <td className="sticky-col" style={ruleLabelStyle}>Chuẩn · TD · Đ trắng</td>
                {days.map(d => {
                    const exp = getExp(d);
                    return <td key={`td-d-white-exp-${d}`} style={ruleCellStyle}>{exp?.NIGHT?.TD_WHITE ?? "-"}</td>;
                })}
                <td colSpan={9} />
            </tr>

            {/* K trắng T7 (thực tế) */}
            <tr style={{ background: BG.kWhite }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, borderLeft: "3px dashed #999" }}>TD · K trắng (T7)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`td-kwhite-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d), borderTop: "1px dashed #d1d5db" }}>{p.K_WHITE}</td>;
                })}
                <td colSpan={9} />
            </tr>
            {/* K trắng T7 (chuẩn) */}
            <tr>
                <td className="sticky-col" style={ruleLabelStyle}>Chuẩn · TD · K trắng</td>
                {days.map(d => {
                    const exp = getExp(d);
                    return <td key={`td-kwhite-exp-${d}`} style={ruleCellStyle}>{exp?.K_WHITE ?? 0}</td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Chỉ có vào Thứ 7 theo rule</td>
            </tr>

            {/* ===== PGD ===== */}
            <tr style={{ background: BG.sectionPGD }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 800 }}>— PHÒNG GIAO DỊCH (PGD) —</td>
                {days.map(d => <td key={`sep-pgd-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }} />)}
                <td colSpan={9} />
            </tr>

            {/* PGD · K (thực tế) */}
            <tr style={{ background: "#FFE3E3" }}>
                <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>PGD · K (ngày)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`pgd-k-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p.PGD.K}</td>;
                })}
                <td colSpan={9} />
            </tr>
            {/* PGD · K (chuẩn) */}
            <tr>
                <td className="sticky-col" style={ruleLabelStyle}>Chuẩn · PGD · K</td>
                {days.map(d => {
                    const exp = getExp(d);
                    return <td key={`pgd-k-exp-${d}`} style={ruleCellStyle}>{exp?.PGD?.K ?? "-"}</td>;
                })}
                <td colSpan={9} />
            </tr>

            {/* PGD · CA2 (thực tế) */}
            <tr style={{ background: "#FFE8E8" }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>PGD · CA2 (ngày)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`pgd-ca2-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p.PGD.CA2}</td>;
                })}
                <td colSpan={9} />
            </tr>
            {/* PGD · CA2 (chuẩn) */}
            <tr>
                <td className="sticky-col" style={ruleLabelStyle}>Chuẩn · PGD · CA2</td>
                {days.map(d => {
                    const exp = getExp(d);
                    return <td key={`pgd-ca2-exp-${d}`} style={ruleCellStyle}>{exp?.PGD?.CA2 ?? "-"}</td>;
                })}
                <td colSpan={9} />
            </tr>

            {/* PGD · Đ (thực tế) */}
            <tr style={{ background: "#FFE6EA" }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>PGD · Đ (đêm)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`pgd-d-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{p.NIGHT.PGD}</td>;
                })}
                <td colSpan={9} />
            </tr>
            {/* PGD · Đ (chuẩn) */}
            <tr>
                <td className="sticky-col" style={ruleLabelStyle}>Chuẩn · PGD · Đ</td>
                {days.map(d => {
                    const exp = getExp(d);
                    return <td key={`pgd-d-exp-${d}`} style={ruleCellStyle}>{exp?.NIGHT?.PGD ?? "-"}</td>;
                })}
                <td colSpan={9} />
            </tr>

            {/* ===== Tổng hợp ===== */}
            {/* Giữ nguyên 3 hàng tổng, vì “chuẩn” từng ngày đã hiển thị phía trên */}
            <tr style={{ background: BG.totalTD, fontWeight: 700 }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TỔNG TD</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`sum-td-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{tdTotal(p)}</td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Mọi vị trí tại Tổng đài (ngày + đêm + K trắng)</td>
            </tr>

            <tr style={{ background: BG.totalPGD, fontWeight: 700 }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TỔNG PGD</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`sum-pgd-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{pgdTotal(p)}</td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Mọi vị trí tại PGD (ngày + đêm)</td>
            </tr>

            <tr style={{ background: BG.totalALL, fontWeight: 800 }}>
                <td className="sticky-col" style={{ ...tdStickyLeft }}>TỔNG (TD + PGD)</td>
                {days.map(d => {
                    const p = perDayByPlace?.[d] ?? EMPTY;
                    console.log("DAY", d, "planned", perDayByPlace?.[d], "expected", expectedByDay?.[d]);
                    return <td key={`sum-all-${d}`} style={{ ...tdCenter, ...wstyle(year, month, d) }}>{tdTotal(p) + pgdTotal(p)}</td>;
                })}
                <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Tổng nhân sự toàn bộ vị trí</td>
            </tr>
        </>
    );
}
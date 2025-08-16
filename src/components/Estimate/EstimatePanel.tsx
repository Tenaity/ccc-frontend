import React from "react";
import type { EstimateResponse } from "../../types";

export default function EstimatePanel({
    data, loading, error,
}: { data: EstimateResponse | null; loading: boolean; error: string | null }) {
    const card = {
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: 12,
        background: "#fff",
    } as const;

    const pill = (bg: string, color = "#111") => ({
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontWeight: 600,
        background: bg,
        color,
        border: "1px solid rgba(0,0,0,0.06)",
        fontSize: 12,
    });

    if (loading) return <div style={card}>Đang tính nhu cầu/cung…</div>;
    if (error) return <div style={{ ...card, color: "#b91c1c", borderColor: "#fecaca" }}>Estimate lỗi: {error}</div>;
    if (!data) return null;

    const delta = data.delta_credits;
    const deltaStyle =
        delta < 0 ? pill("#FEE2E2", "#991B1B") :
            delta > 0 ? pill("#DCFCE7", "#14532D") :
                pill("#E5E7EB", "#111827");

    return (
        <div style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            marginBottom: 12
        }}>
            <div style={card}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>TỔNG CÔNG YÊU CẦU</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{data.required_credits_total}</div>
                <div style={{ marginTop: 8 }}>
                    <span style={pill("#E6F0FF")}>CA1: {data.required_credits_by_shift.CA1}</span>{" "}
                    <span style={pill("#FFE8CC")}>CA2: {data.required_credits_by_shift.CA2}</span>{" "}
                    <span style={pill("#E6FFEA")}>K: {data.required_credits_by_shift.K}</span>{" "}
                    <span style={pill("#FFE6EA")}>Đ: {data.required_credits_by_shift.Đ}</span>{" "}
                    <span style={pill("#EDEBFF")}>HC: {data.required_credits_by_shift.HC}</span>
                </div>
            </div>

            <div style={card}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>TỔNG CÔNG NGUỒN CUNG</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{data.supply_credits_total}</div>
                <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                    Staff: {data.meta.staff_total} · HC: {data.meta.hc_count} ·
                    {" "}T2–T6: {data.meta.weekdays} · T7: {data.meta.saturdays} · CN: {data.meta.sundays} · Lễ: {data.meta.holidays}
                </div>
            </div>

            <div style={card}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>CHÊNH LỆCH (cung − cầu)</div>
                <div style={{ marginTop: 6 }}>
                    <span style={deltaStyle}>
                        {delta > 0 ? `Dư ${delta} công` : delta < 0 ? `Thiếu ${Math.abs(delta)} công` : "Cân bằng"}
                    </span>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                    {data.notes}
                </div>
            </div>
        </div>
    );
}
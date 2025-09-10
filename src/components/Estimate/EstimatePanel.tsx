import React from "react";
import type { EstimateResponse } from "../../types";

const pill = (bg: string) => ({
    display: "inline-block",
    padding: "2px 8px",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    background: bg,
    marginRight: 6,
    fontSize: 12,
});

export default function EstimatePanel({ data, loading, error }: {
    data: EstimateResponse | null;
    loading: boolean;
    error: string | null;
}) {
    if (loading) return <div style={{ padding: 8 }}>Đang tính toán nhu cầu công…</div>;
    if (error) return <div style={{ padding: 8, color: "#b91c1c" }}>Estimate lỗi: {error}</div>;
    if (!data) return null;

    // Phòng thủ field
    const reqCreditsByShift = data.required_credits_by_shift ?? {};
    const reqByCode = data.required_shifts_by_code ?? {};
    const CA1c = reqCreditsByShift.CA1 ?? 0;
    const CA2c = reqCreditsByShift.CA2 ?? 0;
    const Kc = reqCreditsByShift.K ?? 0;
    const HCc = reqCreditsByShift.HC ?? 0;
    const Dc = reqCreditsByShift["Đ"] ?? 0;
    const Pc = reqCreditsByShift.P ?? 0;

    const monthLabel = `${String(data.month).padStart(2, "0")}/${data.year}`;
    const rankBalance = (data as any).rank_balance as Record<string, { r1: number; r2: number }> | undefined;

    return (
        <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 12, background: "#fafafa" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Ước tính nhu cầu công — {monthLabel}</div>

            <div style={{ marginBottom: 8 }}>
                <span style={pill("#F4F4F5")}>Ngày trong tháng: {data.days_in_month}</span>{" "}
                <span style={pill("#E8F0F7")}>Tổng slot (người-ca): {data.required_shifts_total}</span>{" "}
                <span style={pill("#EAF7EA")}>Tổng công quy đổi: {data.required_credits_total}</span>{" "}
                <span style={pill("#FFF7EA")}>Tổng cung (quota): {data.supply_total}</span>{" "}
                <span style={pill(data.delta_total >= 0 ? "#E9FBF0" : "#FFEAEA")}>
                    Dư/Thiếu công: {data.delta_total}
                </span>
            </div>

            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                <div style={{ marginBottom: 4 }}><strong>Công theo mã:</strong></div>
                <div>
                    <span style={pill("#E6F0FF")}>CA1: {CA1c}</span>
                    <span style={pill("#FFE8CC")}>CA2: {CA2c}</span>
                    <span style={pill("#E6FFEA")}>K: {Kc}</span>
                    <span style={pill("#EDEBFF")}>HC: {HCc}</span>
                    <span style={pill("#FFE6EA")}>Đ: {Dc}</span>
                    <span style={pill("#EEE")}>P: {Pc}</span>
                </div>

                <div style={{ marginTop: 10 }}>
                    <strong>Slot theo mã:</strong>{" "}
                    <span style={pill("#E6F0FF")}>
                        CA1: {data?.required_credits_by_shift?.CA1 ?? 0}
                    </span>
                    <span style={pill("#FFE8CC")}>CA2: {reqByCode.CA2 ?? 0}</span>
                    <span style={pill("#E6FFEA")}>K: {reqByCode.K ?? 0}</span>
                    <span style={pill("#EDEBFF")}>HC: {reqByCode.HC ?? 0}</span>
                    <span style={pill("#FFE6EA")}>Đ: {reqByCode["Đ"] ?? 0}</span>
                    <span style={pill("#EEE")}>P: {reqByCode.P ?? 0}</span>
                </div>

                {rankBalance ? (
                    <div style={{ marginTop: 10 }}>
                        <div><strong>Rank balance (7d):</strong></div>
                        {Object.entries(rankBalance).map(([k, v]) => (
                            <div key={k} style={{ marginBottom: 2 }}>
                                {k}: r1={v.r1} r2={v.r2}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
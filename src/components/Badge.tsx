import React from "react";
import type { ShiftCode } from "../types";

type Variant =
    | "td"            // mặc định: trực tại Tổng đài (ngày)
    | "pgd"           // trực PGD (ngày hoặc đêm)
    | "k-white"       // K nền trắng (thứ 7, TD)
    | "leader-day"    // K @ TD (trưởng ca ngày)
    | "leader-night"  // Đ @ TD (trưởng ca đêm)
    | "night-white"   // Đ trắng @ TD
    | "night-pgd";    // Đ @ PGD

export default function Badge({
    code,
    variant = "td",
    crown,
    rank,
}: {
    code: ShiftCode | "";
    variant?: Variant;
    /** legacy prop from old code */
    crown?: boolean;
}) {
    if (!code) return <span style={{ color: "#aaa" }}>—</span>;

    const base: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 6px",
        borderRadius: 6,
        border: "1px solid #e5e7eb",
        fontSize: 12,
        fontWeight: 500,
        background: pickBg(code),
    };

    // màu/viền theo variant
    switch (variant) {
        case "pgd":
            base.background = "#F7D1D1";               // nền đỏ nhạt (PGD)
            base.border = "1px solid #e06b6b";
            break;
        case "k-white":
            base.background = "#FFFFFF";               // nền trắng, viền gạch
            base.border = "1.5px dashed #999";
            break;
        case "leader-day":
            base.border = "1.5px solid #16a34a";       // xanh lá
            base.boxShadow = "0 0 0 1px rgba(22,163,74,.12) inset";
            break;
        case "leader-night":
            base.border = "1.5px solid #7c3aed";       // tím
            base.boxShadow = "0 0 0 1px rgba(124,58,237,.12) inset";
            break;
        case "night-white":
            base.background = "#FFFFFF";               // hồng rất nhạt (Đ trắng @ TD)
            base.border = "1px solid #f1a7b5";
            break;
        case "night-pgd":
            base.background = "#FFDDE0";               // hồng/đỏ nhạt hơn PGD ngày để phân biệt
            base.border = "1px solid #e06b6b";
            break;
        case "td":
        default:
            // giữ mặc định theo ca (pickBg)
            break;
    }

    // 👑: hiển thị nếu crown=true hoặc là leader
    const showCrown =
        !!crown || variant === "leader-day" || variant === "leader-night";

    if (rank === 1) {
        base.border = "2px solid #111827";
    } else if (rank === 2) {
        base.border = "1.5px dashed #9ca3af";
    }

    return (
        <span style={base}>
            {code}
            {showCrown ? <span title="Trưởng ca">👑</span> : null}
        </span>
    );
}

function pickBg(code: ShiftCode | "") {
    switch (code) {
        case "CA1": return "#E6F0FF";  // xanh dương nhạt
        case "CA2": return "#FFE8CC";  // cam nhạt
        case "K": return "#E6FFEA";  // xanh lá nhạt
        case "HC": return "#EDEBFF";  // tím nhạt (hành chính)
        case "Đ": return "#FFE6EA";  // hồng nhạt (đêm)
        case "P": return "#EEEEEE";  // xám
        default: return "#F8F8F8";
    }
}
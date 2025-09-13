import React from "react";
import type { ShiftCode } from "../types";
import { cn } from "../lib/utils";

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
    pinned,
}: {
    code: ShiftCode | "";
    variant?: Variant;
    /** legacy prop from old code */
    crown?: boolean;
    pinned?: boolean;
    rank?: number;
}) {
    if (!code) return <span className="text-muted-foreground">—</span>;

    const variantClass: Record<Variant, string> = {
        td: "",
        pgd: "bg-rose-100 border-rose-400",
        "k-white": "bg-white border-dashed border-gray-400",
        "leader-day":
            "border-2 border-green-600 shadow-[0_0_0_1px_rgba(22,163,74,0.12)_inset]",
        "leader-night":
            "border-2 border-violet-600 shadow-[0_0_0_1px_rgba(124,58,237,0.12)_inset]",
        "night-white": "bg-white border-rose-200",
        "night-pgd": "bg-rose-200 border-rose-400",
    };

    const rankClass =
        rank === 1
            ? "border-2 border-gray-900"
            : rank === 2
                ? "border border-dashed border-gray-400"
                : "border";

    // 👑: hiển thị nếu crown=true hoặc là leader
    const showCrown =
        !!crown || variant === "leader-day" || variant === "leader-night";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-md text-xs font-medium",
                pickBg(code),
                rankClass,
                variantClass[variant]
            )}
        >
            {pinned ? <span title="Fixed" className="mr-1">📌</span> : null}
            {code}
            {showCrown ? <span title="Trưởng ca" className="ml-1">👑</span> : null}
        </span>
    );
}

function pickBg(code: ShiftCode | "") {
    switch (code) {
        case "CA1":
            return "bg-blue-100";
        case "CA2":
            return "bg-orange-100";
        case "K":
            return "bg-green-100";
        case "HC":
            return "bg-indigo-100";
        case "Đ":
            return "bg-rose-100";
        case "P":
            return "bg-gray-200";
        default:
            return "bg-gray-100";
    }
}
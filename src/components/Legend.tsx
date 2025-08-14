import React from "react";

export default function Legend({ label, bg }: { label: string; bg: string }) {
    return (
        <span style={{
            display: "inline-block", padding: "2px 8px", borderRadius: 6,
            background: bg, border: "1px solid #ddd", marginRight: 6
        }}>
            {label}
        </span>
    );
}

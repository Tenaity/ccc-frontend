import React from "react";
import { cva } from "class-variance-authority";
import type { ShiftCode } from "@/types";
import { cn } from "@/lib/utils";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Crown, Pin } from "lucide-react";

const badgeVariant = cva(
  "inline-flex min-w-[3rem] items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-tight transition-colors",
  {
    variants: {
      intent: {
        td: "bg-blue-50 text-blue-900 ring-1 ring-blue-200",
        pgd: "bg-rose-50 text-rose-900 ring-1 ring-rose-200",
        "leader-day":
          "bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300",
        "leader-night":
          "bg-violet-50 text-violet-900 ring-2 ring-violet-300",
        "night-td": "bg-slate-50 text-slate-900 ring-1 ring-slate-200",
        "night-pgd": "bg-rose-100 text-rose-900 ring-1 ring-rose-300",
        off: "bg-muted text-muted-foreground ring-1 ring-border/70",
        fixed: "bg-primary/10 text-primary ring-1 ring-primary/40",
      },
    },
    defaultVariants: {
      intent: "td",
    },
  }
);

const codeBackground: Record<ShiftCode, string> = {
  CA1: "bg-blue-100 text-blue-900",
  CA2: "bg-amber-100 text-amber-900",
  K: "bg-emerald-100 text-emerald-900",
  HC: "bg-indigo-100 text-indigo-900",
  Đ: "bg-rose-100 text-rose-900",
  P: "bg-slate-200 text-slate-900",
};

export default function Badge({
  code,
  variant = "td",
  crown,
  rank,
  pinned,
}: {
  code: ShiftCode | string | "";
  variant?:
    | "td"
    | "pgd"
    | "leader-day"
    | "leader-night"
    | "night-td"
    | "night-pgd"
    | "off"
    | "fixed";
  crown?: boolean;
  pinned?: boolean;
  rank?: number | null;
}) {
  if (!code) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  const baseColor = codeBackground[code as ShiftCode] ?? "bg-muted";
  const rankClass =
    rank === 1
      ? "border border-primary/60"
      : rank === 2
        ? "border border-dashed border-primary/40"
        : "border border-transparent";

  const showCrown = crown || variant === "leader-day" || variant === "leader-night";

  const showBaseColor = variant === "td" || variant === "pgd";

  return (
    <UiBadge
      className={cn(
        badgeVariant({ intent: variant }),
        showBaseColor ? baseColor : undefined,
        rankClass
      )}
    >
      {pinned ? <Pin className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> : null}
      <span>{code}</span>
      {showCrown ? <Crown className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" /> : null}
    </UiBadge>
  );
}
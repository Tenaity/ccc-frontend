import React from "react"
import type { ShiftCode } from "@/types"
import { cn } from "@/lib/utils"
import { Badge as UiBadge } from "@/components/ui/badge"
import { Crown, Pin } from "lucide-react"

const codeBackground: Record<ShiftCode, string> = {
  CA1: "bg-blue-100 text-blue-900",
  CA2: "bg-amber-100 text-amber-900",
  K: "bg-emerald-100 text-emerald-900",
  HC: "bg-indigo-100 text-indigo-900",
  Đ: "bg-rose-100 text-rose-900",
  P: "bg-slate-200 text-slate-900",
}

type BadgeVariant =
  | "default"
  | "leader"
  | "night"
  | "pgd"
  | "fixed"
  | "off"
  | "duplicate"

interface ScheduleBadgeProps {
  code: ShiftCode | string | ""
  variant?: BadgeVariant
  crown?: boolean
  pinned?: boolean
  rank?: number | null
}

export default function Badge({
  code,
  variant = "default",
  crown,
  rank,
  pinned,
}: ScheduleBadgeProps) {
  if (!code) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const baseColor = codeBackground[code as ShiftCode] ?? "bg-muted"
  const rankClass =
    variant === "duplicate"
      ? "border border-transparent"
      : rank === 1
        ? "border border-primary/60"
        : rank === 2
          ? "border border-dashed border-primary/40"
          : "border border-transparent"

  const uiVariant: React.ComponentProps<typeof UiBadge>["variant"] = (() => {
    switch (variant) {
      case "leader":
        return "leader"
      case "night":
        return "night"
      case "pgd":
        return "pgd"
      case "fixed":
        return "fixed"
      case "off":
        return "off"
      case "duplicate":
        return "duplicate"
      default:
        return "muted"
    }
  })()

  const showCrown =
    crown ||
    variant === "leader" ||
    variant === "night" ||
    (variant === "duplicate" && (code === "K" || code === "Đ"))

  const showBaseColor =
    variant === "default" ||
    variant === "leader" ||
    variant === "pgd" ||
    variant === "duplicate" ||
    code === "CA1" ||
    code === "CA2"

  const duplicateAccent =
    variant === "duplicate"
      ? "ring-2 ring-destructive/70 text-destructive shadow-[0_0_0_1px_rgba(248,113,113,0.3)]"
      : null

  return (
    <UiBadge
      variant={uiVariant}
      className={cn(
        "inline-flex min-w-[3rem] items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-tight transition-colors",
        showBaseColor ? baseColor : undefined,
        duplicateAccent,
        rankClass
      )}
    >
      {pinned ? <Pin className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> : null}
      <span>{code}</span>
      {showCrown ? <Crown className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" /> : null}
    </UiBadge>
  )
}

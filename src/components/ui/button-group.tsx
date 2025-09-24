import * as React from "react"

import { cn } from "@/lib/utils"

export interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: "horizontal" | "vertical"
}

type ButtonLikeElement = React.ReactElement<
  { className?: string; size?: string } & Record<string, unknown>
>

export function ButtonGroup({
  children,
  className,
  orientation = "horizontal",
}: ButtonGroupProps) {
  const items = React.Children.toArray(children).filter(
    (child): child is ButtonLikeElement => React.isValidElement(child),
  )

  return (
    <div
      className={cn(
        "inline-flex gap-px rounded-full border border-border/60 bg-muted/60 p-1 shadow-sm backdrop-blur-sm supports-[backdrop-filter]:bg-muted/40",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
      role="group"
    >
      {items.map((child, index) =>
        React.cloneElement(child, {
          className: cn(
            "rounded-full px-4 text-sm font-medium",
            orientation === "horizontal"
              ? index === 0
                ? "rounded-l-full"
                : index === items.length - 1
                  ? "rounded-r-full"
                  : "rounded-none"
              : index === 0
                ? "rounded-t-full"
                : index === items.length - 1
                  ? "rounded-b-full"
                  : "rounded-none",
            child.props.className,
          ),
          size: child.props.size ?? "sm",
        }),
      )}
    </div>
  )
}

ButtonGroup.displayName = "ButtonGroup"

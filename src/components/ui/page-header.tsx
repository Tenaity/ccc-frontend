import React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-400/90 via-blue-400/90 to-indigo-400/90 bg-clip-text text-transparent">
        {title}
      </h1>
      {description && (
        <p className="text-base text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

import * as React from "react"

import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
}

function Skeleton({ className, delay = 300, ...props }: SkeletonProps) {
  const [visible, setVisible] = React.useState(delay <= 0)

  React.useEffect(() => {
    if (delay <= 0) {
      setVisible(true)
      return
    }
    setVisible(false)
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!visible) {
    return null
  }

  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/80",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }

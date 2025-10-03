import type { ComponentType } from "react"
import * as Icons from "lucide-react"

export function resolveShiftIcon(iconName: string): ComponentType<any> {
  const iconMap = Icons as unknown as Record<string, ComponentType<any>>
  return iconMap[iconName] || Icons.Clock
}

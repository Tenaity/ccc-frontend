import type { ComponentType } from "react"
import * as Icons from "lucide-react"

export function resolveIcon(iconName: string) {
  const iconMap = Icons as unknown as Record<string, ComponentType<any>>
  const IconComponent = iconMap[iconName]
  return IconComponent || Icons.Building2
}

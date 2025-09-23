import { CalendarIcon, LayoutDashboardIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type AppRoute = {
  path: string
  label: string
  description?: string
  icon: LucideIcon
}

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Dashboard",
    description: "Hiển thị KPI và trạng thái tài liệu mẫu",
    icon: LayoutDashboardIcon,
  },
  {
    path: "/schedule",
    label: "Schedule",
    description: "Quản lý lịch phân ca dạng ma trận",
    icon: CalendarIcon,
  },
]

export function matchRoute(pathname: string): AppRoute | undefined {
  const normalized = pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname
  return appRoutes.find((route) => route.path === normalized)
}

import { CalendarIcon, LayoutDashboardIcon, BotIcon, Upload, Scissors } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type AppRoute = {
  path: string
  label: string
  description?: string
  icon: LucideIcon
  children?: AppRoute[]
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
  {
    path: "/chatbot",
    label: "CRUD Chatbot",
    description: "Quản lý dữ liệu chatbot Point_v3",
    icon: BotIcon,
    children: [
      {
        path: "/chatbot/upload",
        label: "Upload File",
        description: "Upload và xử lý file qua webhook",
        icon: Upload,
      },
      {
        path: "/chatbot/chunking",
        label: "Chunking",
        description: "Quản lý và xem nội dung text từ file đã upload",
        icon: Scissors,
      },
    ],
  },
]

export function matchRoute(pathname: string): AppRoute | undefined {
  const normalized = pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname

  // Check top-level routes first
  for (const route of appRoutes) {
    if (route.path === normalized) return route

    // Check children routes
    if (route.children) {
      const childMatch = route.children.find((child) => child.path === normalized)
      if (childMatch) return childMatch
    }
  }

  return undefined
}

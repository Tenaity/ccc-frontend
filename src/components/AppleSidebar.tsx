import * as React from "react"
import { NavLink, useMatch, useLocation } from "react-router-dom"
import {
  ChevronRight,
  Sparkles,
  Zap,
  ArrowUpCircle,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { appRoutes, type AppRoute } from "@/app/routes"

interface AppleSidebarProps {
  className?: string
}

// macOS Window Controls Component
function WindowControls() {
  return (
    <div className="flex items-center gap-2 mb-6">
      <button
        className={cn(
          "h-3 w-3 rounded-full transition-all duration-200",
          "bg-gradient-to-br from-[#ff6159] to-[#ff4136]",
          "shadow-[0_2px_8px_rgba(255,95,87,0.5)]",
          "hover:shadow-[0_3px_12px_rgba(255,95,87,0.7)] hover:scale-110",
          "active:scale-95"
        )}
        aria-label="Close"
      />
      <button
        className={cn(
          "h-3 w-3 rounded-full transition-all duration-200",
          "bg-gradient-to-br from-[#ffbd2e] to-[#ffa500]",
          "shadow-[0_2px_8px_rgba(254,188,46,0.5)]",
          "hover:shadow-[0_3px_12px_rgba(254,188,46,0.7)] hover:scale-110",
          "active:scale-95"
        )}
        aria-label="Minimize"
      />
      <button
        className={cn(
          "h-3 w-3 rounded-full transition-all duration-200",
          "bg-gradient-to-br from-[#28cd41] to-[#1fb438]",
          "shadow-[0_2px_8px_rgba(40,200,64,0.5)]",
          "hover:shadow-[0_3px_12px_rgba(40,200,64,0.7)] hover:scale-110",
          "active:scale-95"
        )}
        aria-label="Maximize"
      />
    </div>
  )
}

// Brand Logo Component
function BrandLogo() {
  return (
    <div className="group mb-6">
      <div className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-900/60 cursor-pointer">
        <div
          className={cn(
            "relative flex items-center justify-center rounded-xl p-3.5",
            "bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600",
            "shadow-[0_12px_48px_rgba(56,189,248,0.5),0_6px_24px_rgba(139,92,246,0.4)]",
            "group-hover:shadow-[0_16px_64px_rgba(56,189,248,0.6),0_8px_32px_rgba(139,92,246,0.5)]",
            "group-hover:scale-110 transition-all duration-300"
          )}
        >
          <ArrowUpCircle className="size-6 text-white drop-shadow-lg" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent group-hover:from-sky-600 group-hover:to-indigo-600 transition-all duration-300">
            Customer Care
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-sky-600 transition-colors duration-300">
            Operations Center
          </span>
        </div>
      </div>
    </div>
  )
}

// Navigation Item Component
interface NavItemProps {
  route: AppRoute
  level?: number
}

function NavItem({ route, level = 0 }: NavItemProps) {
  const location = useLocation()
  const match = useMatch({
    path: route.path === "/" ? "/" : `${route.path}/*`,
    end: route.path === "/",
  })

  // Check if any child is active
  const hasActiveChild = React.useMemo(() => {
    if (!route.children || route.children.length === 0) return false
    return route.children.some(child => location.pathname === child.path)
  }, [route.children, location.pathname])

  const isActive = !!match || hasActiveChild
  const [isOpen, setIsOpen] = React.useState(isActive)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    if (isActive) setIsOpen(true)
  }, [isActive])

  const hasChildren = route.children && route.children.length > 0

  return (
    <div className="w-full">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative group rounded-xl transition-all duration-300",
          level === 0 && "mb-1"
        )}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "transition-all duration-300",
              "hover:bg-gradient-to-r hover:from-white/80 hover:to-sky-50/60",
              "dark:hover:from-slate-900/80 dark:hover:to-slate-800/60",
              isActive && [
                "bg-gradient-to-r from-white/95 to-sky-50/80",
                "shadow-[0_4px_20px_rgba(56,189,248,0.15)]",
                "ring-2 ring-sky-400/50",
                "dark:from-slate-900/90 dark:to-slate-800/80",
              ]
            )}
          >
            {/* Animated Background */}
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/5 via-indigo-400/10 to-purple-400/5 animate-gradient-x" />
            )}

            {/* Icon */}
            <div
              className={cn(
                "relative flex items-center justify-center rounded-lg p-2 shrink-0",
                "transition-all duration-300 shadow-sm",
                isActive
                  ? "bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-sky-500/50"
                  : "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 text-slate-600 dark:text-slate-400",
                isHovered &&
                  !isActive &&
                  "scale-105 from-sky-100 to-indigo-100 text-sky-600 shadow-md"
              )}
            >
              <route.icon className="size-4" />
              {isActive && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
              )}
            </div>

            {/* Label */}
            <span
              className={cn(
                "flex-1 text-left font-medium text-sm transition-colors",
                isActive
                  ? "text-slate-900 dark:text-white font-semibold"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              {route.label}
            </span>

            {/* Badge & Chevron */}
            <div className="flex items-center gap-2">
              {hasChildren && (
                <span
                  className={cn(
                    "flex items-center justify-center min-w-[18px] h-[18px] px-1.5",
                    "text-[10px] font-bold rounded-md",
                    isActive
                      ? "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  )}
                >
                  {route.children?.length}
                </span>
              )}
              <ChevronRight
                className={cn(
                  "size-4 transition-all duration-300 shrink-0",
                  isOpen && "rotate-90",
                  isActive ? "text-sky-600" : "text-slate-400"
                )}
              />
            </div>
          </button>
        ) : (
          <NavLink
            to={route.path}
            end
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "transition-all duration-300",
              "hover:bg-gradient-to-r hover:from-white/80 hover:to-sky-50/60",
              "dark:hover:from-slate-900/80 dark:hover:to-slate-800/60",
              match && [
                "bg-gradient-to-r from-white/95 to-sky-50/80",
                "shadow-[0_4px_20px_rgba(56,189,248,0.15)]",
                "ring-2 ring-sky-400/50",
                "dark:from-slate-900/90 dark:to-slate-800/80",
              ]
            )}
          >
            {/* Animated Background */}
            {match && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/5 via-indigo-400/10 to-purple-400/5 animate-gradient-x" />
            )}

            {/* Icon */}
            <div
              className={cn(
                "relative flex items-center justify-center rounded-lg p-2 shrink-0",
                "transition-all duration-300 shadow-sm z-10",
                match
                  ? "bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-sky-500/50"
                  : "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 text-slate-600 dark:text-slate-400",
                isHovered &&
                  !match &&
                  "scale-105 from-sky-100 to-indigo-100 text-sky-600 shadow-md"
              )}
            >
              <route.icon className="size-4" />
              {match && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
              )}
            </div>

            {/* Label */}
            <span
              className={cn(
                "flex-1 text-left font-medium text-sm transition-colors z-10",
                match
                  ? "text-slate-900 dark:text-white font-semibold"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              {route.label}
            </span>

            {/* Active Indicator */}
            {match && route.path === "/" && (
              <Zap className="size-3.5 text-sky-600 animate-pulse z-10" />
            )}
          </NavLink>
        )}
      </div>

      {/* Children */}
      {hasChildren && isOpen && (
        <div className="ml-4 mt-1 pl-4 border-l-2 border-sky-200/60 dark:border-sky-800/40 space-y-0.5 py-1">
          {route.children?.map((child) => (
            <SubNavItem key={child.path} route={child} />
          ))}
        </div>
      )}
    </div>
  )
}

// Sub Navigation Item Component
function SubNavItem({ route }: { route: AppRoute }) {
  const match = useMatch({ path: route.path, end: true })
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <NavLink
      to={route.path}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group flex items-center gap-2.5 px-3 py-2 rounded-lg",
        "transition-all duration-300",
        "hover:bg-gradient-to-r hover:from-white/70 hover:to-sky-50/50",
        "dark:hover:from-slate-900/70 dark:hover:to-slate-800/50",
        match && [
          "bg-gradient-to-r from-white/90 to-sky-50/70",
          "shadow-md ring-1 ring-sky-400/40",
          "dark:from-slate-900/80 dark:to-slate-800/70",
        ]
      )}
    >
      {/* Animated Background */}
      {match && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-400/5 via-indigo-400/8 to-purple-400/5 animate-gradient-x" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-md p-1.5 shrink-0",
          "transition-all duration-300 shadow-sm z-10",
          match
            ? "bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-sky-500/40 scale-110"
            : "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 text-slate-500 dark:text-slate-500",
          isHovered &&
            !match &&
            "scale-105 from-sky-100 to-indigo-100 text-sky-600"
        )}
      >
        <route.icon className="size-3.5" />
        {match && (
          <div className="absolute inset-0 rounded-md bg-gradient-to-br from-white/20 to-transparent" />
        )}
      </div>

      {/* Label */}
      <span
        className={cn(
          "flex-1 text-sm font-medium transition-colors z-10",
          match
            ? "text-slate-900 dark:text-white font-semibold"
            : "text-slate-600 dark:text-slate-400"
        )}
      >
        {route.label}
      </span>

      {/* Active Indicator */}
      {match && (
        <Sparkles className="size-3 text-sky-600 animate-pulse z-10" />
      )}
    </NavLink>
  )
}

// Main Apple Sidebar Component
export function AppleSidebar({ className }: AppleSidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-screen w-64 shrink-0",
        "bg-gradient-to-b from-white/98 via-white/96 to-slate-50/95",
        "dark:from-slate-950/98 dark:via-slate-950/96 dark:to-slate-900/95",
        "backdrop-blur-3xl backdrop-saturate-[1.8]",
        "border-r-2 border-slate-200/70 dark:border-slate-800/70",
        "shadow-[8px_0_32px_rgba(15,23,42,0.08)]",
        "dark:shadow-[8px_0_48px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col px-4 pt-6 pb-4 border-b-2 border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-b from-white/50 to-transparent dark:from-slate-900/30">
        <WindowControls />
        <BrandLogo />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-3 px-3">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Sparkles className="size-3" />
            <span>Navigation</span>
          </div>
        </div>
        <nav className="space-y-0.5">
          {appRoutes.map((route) => (
            <NavItem key={route.path} route={route} />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t-2 border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-t from-white/30 to-transparent dark:from-slate-900/20">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-center size-9 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm">
            CN
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              Customer Care Ops
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              ops@ccc.local
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

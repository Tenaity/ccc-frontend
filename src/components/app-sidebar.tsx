import * as React from "react"
import {
  ArrowUpCircleIcon,
  HelpCircleIcon,
  SettingsIcon,
  ChevronRight,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { NavLink, useMatch } from "react-router-dom"

import { appRoutes, type AppRoute } from "@/app/routes"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { GlassButton, GlassBadge } from "@/components/ui/glass"
import { cn } from "@/lib/utils"

type SecondaryNavItem = {
  title: string
  url: string
  icon: LucideIcon
}

const secondaryNav: SecondaryNavItem[] = [
  {
    title: "Settings",
    url: "#settings",
    icon: SettingsIcon,
  },
  {
    title: "Support",
    url: "#support",
    icon: HelpCircleIcon,
  },
]

const currentUser = {
  name: "Customer Care Ops",
  email: "ops@ccc.local",
  avatar: "/avatars/shadcn.jpg",
}

function SidebarSubMenuItem({ child }: { child: AppRoute }) {
  const childMatch = useMatch({
    path: child.path,
    end: true,
  })

  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
        isActive={!!childMatch}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group relative transition-all duration-300 rounded-xl overflow-hidden",
          "hover:bg-gradient-to-r hover:from-white/90 hover:via-sky-50/80 hover:to-white/90",
          "hover:text-foreground hover:shadow-md hover:scale-[1.02]",
          "dark:hover:from-slate-900/80 dark:hover:via-slate-800/80 dark:hover:to-slate-900/80",
          childMatch && [
            "bg-gradient-to-r from-white/95 via-sky-50/90 to-white/95",
            "text-foreground shadow-xl ring-2 ring-sky-400/50",
            "dark:from-slate-900/85 dark:via-slate-800/85 dark:to-slate-900/85",
            "dark:ring-sky-400/30"
          ]
        )}
      >
        <NavLink to={child.path} className="flex items-center gap-3 relative z-10">
          {/* Animated gradient background */}
          {childMatch && (
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 via-indigo-400/10 to-purple-400/5 animate-gradient-x" />
          )}

          <div className={cn(
            "relative flex items-center justify-center rounded-lg p-2 transition-all duration-300",
            "shadow-sm",
            childMatch
              ? "bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-500 text-white shadow-lg shadow-sky-500/50 scale-110"
              : "bg-gradient-to-br from-white to-slate-50 text-muted-foreground group-hover:from-sky-100 group-hover:to-indigo-100 group-hover:text-sky-600 group-hover:shadow-md dark:from-slate-800/80 dark:to-slate-900/80",
            isHovered && !childMatch && "scale-105 shadow-md"
          )}>
            <child.icon className="size-3.5 shrink-0 relative z-10" />
            {childMatch && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
            )}
          </div>

          <span className={cn(
            "truncate font-medium transition-all duration-200",
            childMatch && "font-semibold"
          )}>
            {child.label}
          </span>

          {childMatch && (
            <Sparkles className="ml-auto size-3.5 text-sky-500 animate-pulse" />
          )}
        </NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

function SidebarNavItem({ route }: { route: AppRoute }) {
  const match = useMatch({
    path: route.path === "/" ? "/" : `${route.path}/*`,
    end: route.path === "/",
  })

  const [open, setOpen] = React.useState(!!match)
  const [isHovered, setIsHovered] = React.useState(false)

  // Auto-expand when navigating to child routes
  React.useEffect(() => {
    if (match && !open) {
      setOpen(true)
    }
  }, [match, open])

  if (route.children && route.children.length > 0) {
    return (
      <Collapsible
        key={route.path}
        asChild
        open={open}
        onOpenChange={setOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={route.label}
              isActive={!!match}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={cn(
                "group relative rounded-xl transition-all duration-300 overflow-hidden",
                "hover:bg-gradient-to-r hover:from-white/90 hover:via-sky-50/80 hover:to-white/90",
                "hover:text-foreground hover:shadow-lg hover:scale-[1.02]",
                "dark:hover:from-slate-900/80 dark:hover:via-slate-800/80 dark:hover:to-slate-900/80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                match
                  ? "bg-gradient-to-r from-white/95 via-sky-50/90 to-white/95 text-foreground shadow-xl ring-2 ring-sky-400/60 dark:from-slate-900/85 dark:via-slate-800/85 dark:to-slate-900/85 dark:ring-sky-400/40"
                  : "text-muted-foreground"
              )}
            >
              {match && (
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 via-indigo-400/10 to-purple-400/5 animate-gradient-x" />
              )}

              <div className={cn(
                "relative flex items-center justify-center rounded-lg p-2.5 transition-all duration-300",
                "shadow-sm",
                match
                  ? "bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-500 text-white shadow-lg shadow-sky-500/50"
                  : "bg-gradient-to-br from-white to-slate-50 text-muted-foreground group-hover:from-sky-100 group-hover:to-indigo-100 group-hover:text-sky-600 group-hover:shadow-md dark:from-slate-800/80 dark:to-slate-900/80",
                isHovered && !match && "scale-105 shadow-md"
              )}>
                <route.icon className="size-4 shrink-0 relative z-10" />
                {match && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
                )}
              </div>

              <span className={cn(
                "truncate font-medium transition-all duration-200",
                match && "font-semibold"
              )}>
                {route.label}
              </span>

              <div className="ml-auto flex items-center gap-2">
                {route.children && route.children.length > 0 && (
                  <span className={cn(
                    "flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-md",
                    "text-[10px] font-bold",
                    "bg-slate-100 text-slate-600",
                    "dark:bg-slate-800 dark:text-slate-300",
                    match && "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400"
                  )}>
                    {route.children.length}
                  </span>
                )}
                <ChevronRight className={cn(
                  "size-4 shrink-0 transition-all duration-300",
                  "group-data-[state=open]/collapsible:rotate-90",
                  match ? "text-sky-500" : "text-muted-foreground"
                )} />
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <SidebarMenuSub className={cn(
              "ml-4 border-l-2 pl-4 py-2 space-y-1.5",
              "border-sky-200/60 dark:border-sky-800/40"
            )}>
              {route.children.map((child) => (
                <SidebarSubMenuItem key={child.path} child={child} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem key={route.path}>
      <SidebarMenuButton
        asChild
        tooltip={route.label}
        isActive={!!match}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group relative rounded-xl transition-all duration-300 overflow-hidden",
          "hover:bg-gradient-to-r hover:from-white/90 hover:via-sky-50/80 hover:to-white/90",
          "hover:text-foreground hover:shadow-lg hover:scale-[1.02]",
          "dark:hover:from-slate-900/80 dark:hover:via-slate-800/80 dark:hover:to-slate-900/80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
          match
            ? "bg-gradient-to-r from-white/95 via-sky-50/90 to-white/95 text-foreground shadow-xl ring-2 ring-sky-400/60 dark:from-slate-900/85 dark:via-slate-800/85 dark:to-slate-900/85 dark:ring-sky-400/40"
            : "text-muted-foreground"
        )}
      >
        <NavLink
          to={route.path}
          end
          className="flex w-full min-w-0 items-center gap-3 relative z-10"
        >
          {match && (
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 via-indigo-400/10 to-purple-400/5 animate-gradient-x" />
          )}

          <div className={cn(
            "relative flex items-center justify-center rounded-lg p-2.5 transition-all duration-300",
            "shadow-sm",
            match
              ? "bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-500 text-white shadow-lg shadow-sky-500/50"
              : "bg-gradient-to-br from-white to-slate-50 text-muted-foreground group-hover:from-sky-100 group-hover:to-indigo-100 group-hover:text-sky-600 group-hover:shadow-md dark:from-slate-800/80 dark:to-slate-900/80",
            isHovered && !match && "scale-105 shadow-md"
          )}>
            <route.icon className="size-4 shrink-0 relative z-10" />
            {match && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
            )}
          </div>

          <span className={cn(
            "truncate font-medium transition-all duration-200",
            match && "font-semibold"
          )}>
            {route.label}
          </span>

          {match && route.path === "/" && (
            <Zap className="ml-auto size-3.5 text-sky-500 animate-pulse" />
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className={cn(
        "bg-gradient-to-b from-white/98 via-white/96 to-slate-50/95",
        "dark:from-slate-950/98 dark:via-slate-950/96 dark:to-slate-900/95",
        "backdrop-blur-3xl backdrop-saturate-[1.8]",
        "border-r-2 border-slate-200/70 dark:border-slate-800/70",
        "shadow-[8px_0_32px_rgba(15,23,42,0.08),4px_0_16px_rgba(15,23,42,0.05)]",
        "dark:shadow-[8px_0_48px_rgba(0,0,0,0.3),4px_0_24px_rgba(0,0,0,0.2)]",
        props.className
      )}
    >
      <SidebarHeader className={cn(
        "border-b-2 border-slate-200/70 dark:border-slate-800/70 px-4 py-6",
        "bg-gradient-to-b from-white/50 to-transparent dark:from-slate-900/30"
      )}>
        {/* macOS-style Window Controls */}
        <div className="mb-5 flex items-center gap-2">
          <span className={cn(
            "h-3 w-3 rounded-full transition-all duration-200",
            "bg-gradient-to-br from-[#ff6b5f] to-[#ff4d4d]",
            "shadow-[0_2px_8px_rgba(255,95,87,0.5),0_0_0_1px_rgba(255,95,87,0.2)]",
            "hover:shadow-[0_3px_12px_rgba(255,95,87,0.6)] hover:scale-110"
          )} aria-hidden="true" />
          <span className={cn(
            "h-3 w-3 rounded-full transition-all duration-200",
            "bg-gradient-to-br from-[#ffbd44] to-[#ffa500]",
            "shadow-[0_2px_8px_rgba(254,188,46,0.5),0_0_0_1px_rgba(254,188,46,0.2)]",
            "hover:shadow-[0_3px_12px_rgba(254,188,46,0.6)] hover:scale-110"
          )} aria-hidden="true" />
          <span className={cn(
            "h-3 w-3 rounded-full transition-all duration-200",
            "bg-gradient-to-br from-[#32d74b] to-[#28c840]",
            "shadow-[0_2px_8px_rgba(40,200,64,0.5),0_0_0_1px_rgba(40,200,64,0.2)]",
            "hover:shadow-[0_3px_12px_rgba(40,200,64,0.6)] hover:scale-110"
          )} aria-hidden="true" />
        </div>

        {/* Premium Brand Section */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "data-[slot=sidebar-menu-button]:!p-4",
                "rounded-2xl transition-all duration-300",
                "hover:bg-gradient-to-br hover:from-white/90 hover:to-sky-50/80",
                "hover:shadow-xl hover:scale-[1.02]",
                "dark:hover:from-slate-900/90 dark:hover:to-slate-800/80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                "group"
              )}
            >
              <a href="#brand" className="flex items-center gap-4">
                <div className={cn(
                  "relative flex items-center justify-center rounded-xl p-3",
                  "bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600",
                  "shadow-[0_12px_48px_rgba(56,189,248,0.5),0_6px_24px_rgba(139,92,246,0.4)]",
                  "ring-2 ring-white/30 dark:ring-slate-900/30",
                  "group-hover:shadow-[0_16px_64px_rgba(56,189,248,0.6),0_8px_32px_rgba(139,92,246,0.5)]",
                  "group-hover:scale-110 transition-all duration-300"
                )}>
                  <ArrowUpCircleIcon className="size-6 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/10 to-white/20 animate-shimmer" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-lg font-bold tracking-tight",
                    "bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent",
                    "group-hover:from-sky-600 group-hover:to-indigo-600 transition-all duration-300"
                  )}>
                    Customer Care
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-sky-600 transition-colors duration-300">
                    Operations Center
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "px-3 py-2 mb-2 text-[11px] font-bold uppercase tracking-wider",
            "text-muted-foreground/80"
          )}>
            <div className="flex items-center gap-2">
              <Sparkles className="size-3" />
              <span>Navigation</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-240px)] pr-1">
              <SidebarMenu className="gap-2">
                {appRoutes.map((route) => (
                  <SidebarNavItem key={route.path} route={route} />
                ))}
              </SidebarMenu>
              <ScrollBar orientation="vertical" className="z-50" />
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavSecondary items={secondaryNav} className="mt-auto pt-4" />
      </SidebarContent>
      <SidebarFooter className={cn(
        "border-t-2 border-slate-200/70 dark:border-slate-800/70 p-3",
        "bg-gradient-to-t from-white/30 to-transparent dark:from-slate-900/20"
      )}>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
